import KoaRouter from 'koa-router'
import fs from 'fs'
import { resolve } from 'path'
import { compose, isNull } from '../utils/util'

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
      router[method](prefix + path, ...callback)
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
    callback: compose(target[key])
  })
  return descriptor
}

export const Get = setRouter('get')


export const convert = middleware => (target, key, descriptor) => {
  target[key] = compose(target[key], middleware)
  return descriptor
}

export const Required = paramsObj => convert(async (ctx, next) => {
  let erros = []
  for (let [key, value] of Object.entries(paramsObj)) {
    const ck = ctx.request[key]
    for (let k of value) {
      if (ck) {
        isNull(ck[k]) && erros.push(k)
      } else {
        console.error(`ctx don't have the ctx.${key}'s params`)
      }
    }
  }
  if (erros.length > 0) {
    return (
      ctx.body = {
        code: 0,
        message: `${erros.join(', ')} is required`,
        data: {}
      }
    )
  } 
  await next()
})