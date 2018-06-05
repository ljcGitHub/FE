## 2.路由(二)
在上一章，使用router中间件，但并未看到使用，接着写这bug。

新建router文件夹，并创建user.js
```
import {
  Controller,
  Get
} from '../decorator/router'

@Controller('/api')
export default class userRouter {
  @Get('/getUser')
  async getUser(ctx, next) {
    ctx.body = {
      code: 1,
      message: 'success',
      data: {}
    }
  }
}
```
通过decorator修饰路由，结构非常清晰，易扩展

修改decorator/router.js , 新增以下内容：
```
let routeMap = []

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
```
上面看不懂，可以看下面的未简写的原函数

(对decorator不懂，[脑补地址](http://es6.ruanyifeng.com/#docs/decorator))

```
const setRouter = (method) => {
  return function(path){
      return function (target, key, descriptor) {
        routeMap.push({
            target,
            method,
            path,
            callback: target[key]
        })
        return descriptor
      }
  }
}
```
通过setRouter获取修饰的函数，并push到routeMap中

Controller统一管理路由

前面引入自定义的router，接下来开始初始化定义的路由

修改decorator/router.js中 class Route

```
import fs from 'fs'
import { resolve } from 'path'

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
```
整体的思路：
1. 通过 new Route(app, routerPath) ，参数是实例的koa和业务的router文件地址
2. 执行init函数，获取当前业务的router文件，并加载
3. 通过加载相应的文件，routeMap收集
4. routeMap循环注册路由

启动服务，浏览器输入

[http://localhost:3000/api/getUser](http://localhost:3000/api/getUser)

控制台能显示返回的数据
> {"code":1,"message":"success","data":{}}


decorator/router.js 内容如下：
```
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
```


