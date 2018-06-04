import KoaRouter from 'koa-router'

export class Route {
  constructor(app, routesPath) {
    this.app = app
    this.router = new KoaRouter()
    this.routesPath = routesPath
  }
  init() {
    const { app, router, routesPath } = this
    app.use(router.routes())
    app.use(router.allowedMethods())
    console.log('加载router中间件')
  }
}