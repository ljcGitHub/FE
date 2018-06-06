## 2.路由(三)
在上一章，router装饰结构清晰，不易扩展功能，以下是解决这毛病


koa-router支持多个中间件
```
app.get( '/users/:id',
  async function main(next) {
    this.user = this.params.id
    await next()
  },
  async function logger(next) {
    console.log(this.user)
  }
)
```
koa-compose模块可以将多个中间件合成为一个

Multiple middleware may be given and are composed using [ koa-compose](https://github.com/koajs/compose)
```
const compose = require('koa-compose')

const main = (ctx, next) => {
  this.user = this.params.id
  next()
}

const logger = ctx => {
  console.log(this.user)
}

const middlewares = compose([main, logger])
app.use(middlewares)
```
我们选择koa-router自带的多个中间件，为了支持这个写法

新建utils文件夹，util.js文件
```
export const compose = function (arr, item) {
  if (item) {
    if (arr && arr.constructor === Array) {
      arr.unshift(item)
    } else {
      let a = arr
      arr = [item, a]
    }
  } else {
    if (arr && arr.constructor === Array) return arr
    let a = arr
    arr = [a]
  }
  return arr
}
```
修改router/user.js
```
import {
  Controller,
  Get,
  Required
} from '../decorator/router'

@Controller('/api')
export default class userRouter {
  @Get('/getUser')
  @Required({
    query: ['userid']
  })  
  async getUser(ctx, next) {
    ctx.body = {
      code: 1,
      message: 'success',
      data: {}
    }
  }
}
```
Required是扩展的函数，支持检查接口的参数是否正确，后续可以在扩展支持token校验等。

修改 decorator/router.js
```
import { compose } from '../utils/util'

export const convert = middleware => {
    return (target, key, descriptor) => {
      target[key] = compose(target[key], middleware)
      return descriptor
    }
}
export const Required = (paramsObj) => {
    return convert(async (ctx, next) => {
      console.log('你想校验的参数:' + JSON.stringify(paramsObj))  
      await next()
    })
}
```
上面思路是

1. 修改router init函数 和 setRouter
2. 通过convert函数，获取Required函数并放入当前实例的setRouter中callback
3. 返回装饰的descriptor，给下一个装饰器

```
init = () => {
    const { app, router, routesPath } = this
    let files = fs.readdirSync(routesPath);
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

export const setRouter = method => path => (target, key, descriptor) => {
  routeMap.push({
    target,
    method,
    path,
    callback: compose(target[key])
  })
  return descriptor
}
```
打开浏览器(postman),输入 [http://localhost:3000/api/getUser](http://localhost:3000/api/getUser)
> 你想校验的参数:{"body":["userid"]}

#### koa-bodyparser
推荐使用这个解析request参数的中间件

命令行执行，安装依赖的包
```
npm i -S koa-bodyparser
```
修改 middleware/index.js ,引入这个中间件
```
import bodyParser from 'koa-bodyparser'
import { resolve } from 'path'
import { Route } from '../decorator/router'

const init = (app) => {
  app.use(bodyParser())
  const routesPath = resolve(__dirname, '../router')
  const Router = new Route(app, routesPath)
  Router.init()
}

export default init
```
接下实现 Required对参数的校验

新增 utils/util.js 中 isNull，判断参数是否存在
```
export const isNull = function (value) {
  if (value === null || value === undefined || value === '') {
    return true
  }
  if (value instanceof Array && value.length === 0) {
    return true
  }
  return false
}
```
修改 Required函数, 判断cxt.body , cxt.query , cxt.params (bodyParser解析之后的对象)
```
import { compose, isNull } from '../utils/util'

export const Required = (paramsObj) => {
  return convert(async (ctx, next) => {
    let erros = []
    for (let [key, value] of Object.entries(paramsObj)) {
      const ck = ctx.request[key]
      for (let k of value) {
        if (ck && isNull(ck[k])) {
          erros.push(k)
        } else {
          console.error(`ctx don't have the ctx.${key}'s params`)
        }
      }
    }
    if (erros.length > 0) {
      return (
        ctx.body = {
          code: ERR_FAILURE,
          message: `${erros.join(', ')} is required`,
          data: {}
        }
      )
    }
    await next()
  })
}
```
打开浏览器(postman)输入，以下内容：

[http://localhost:3000/api/getUser](http://localhost:3000/api/getUser)

[http://localhost:3000/api/getUser?userid=1](http://localhost:3000/api/getUser?userid=1)

浏览器(postman)分部显示：
> {"code":0,"message":"userid is required","data":{}}
> {"code":0,"message":"success","data":{}}

利用箭头函数，简化一下 convert / Required 代码
```
export const convert = middleware => (target, key, descriptor) => {
  target[key] = arrCompose(target[key], middleware)
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
```



















