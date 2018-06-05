import KoaRouter from 'koa-router'
import fs from 'fs'
import { resolve } from 'path'

const pathPrefix = Symbol('pathPrefix')
const routeMap = []

export class Route {
  constructor(app, routesPath) {
    this.app = app
    this.router = new KoaRouter()
    this.routesPath = routesPath
  }
  init() {
    const { app, router, routesPath } = this
    let files = fs.readdirSync(routesPath)  
    files.filter((f) => {
      if (f.endsWith('.js')) {
        require(resolve(__dirname, routesPath, f))
      }
      return;
    }, files)
    for (let { target, method, path, callback } of routeMap) {
      const prefix = target[pathPrefix]
      router[method](prefix + path, callback)
    }
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}

export const Controller = path => target => {
  return target.prototype[pathPrefix] = path
}

export const setRouter = method => path => (target, key, descriptor) => {
  routeMap.push({
    target,
    method,
    path,
    callback: target[key]
  })
  return descriptor
}

export const Get = setRouter('get')