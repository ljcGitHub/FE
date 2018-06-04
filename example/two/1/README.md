## 2.路由(一)
本文推荐第三方中间件 koa-router 实现路由管理

#### koa-router
koa-router使用比较简单，深入了解看可以去github看，以下简单描述一下。

```
import Koa from 'koa'
import Router from 'koa-router'

const app = new Koa()
const Router = new Router()
let home = new Router()
// 子路由1
home.get('/', async ( ctx )=>{
  let html = `
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `
  ctx.body = html
})
// 子路由2
let page = new Router()
page.get('/404', async ( ctx )=>{
  ctx.body = '404 page!'
}).get('/helloworld', async ( ctx )=>{
  ctx.body = 'helloworld page!'
})
// 装载所有子路由
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())
// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log('[demo] route-use-middleware is starting at port 3000')
})
```
通过new Router()获取实例，注册相应的路由。
app加载对应的路由中间件
app.use(router.routes()).use(router.allowedMethods())

#### 安装
命令行执行安装依赖的包
```
npm i -S koa-router
```

#### 通过装饰器修饰路由
本文会通过decorators，对路由做处理。

新建decorator文件夹和router.js
```
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
```
为了统一管理中间件，新建middleware文件夹和index.js
```
import { resolve } from 'path'
import { Route } from '../decorator/router'

const init = (app) => {
  const routesPath = resolve(__dirname, '../router')
  const Router = new Route(app, routesPath)
  Router.init()
}

export default init
```

在app.js加载middleware文件夹下index.js
```
import Koa from 'koa'
import middleware from './middleware'

const app = new Koa()

middleware(app)

app.listen(3000, () => {
  console.log('koa2 is starting at port 3000')
})
```
控制台显示
> 加载router中间件




