## 错误处理
错误处理，打算不写入数据库，而是推荐写到log文件下，并且分类为前端和后端的错误日志，并且以时间作为命名。

### 错误收集
错误收集一般要收集代码在哪里报出异常，这样方便快速定位和重显bug。

> 1. 在根目录，新建log的文件夹
> 2. 在log文件夹下，新建client的文件夹(存放前端错误日志)
> 3. 在log文件夹下，新建server的文件夹(存放后端错误日志)

后端： koa的错误收集，通过on注册erro全局事件，每次发现错误，就通过捕抓异常，记录到日志中
前端： 通过window.onerror,捕抓异常，调用接口，写入日志中。

#### 后端的日志上报
修改 /decorator/router.js, 新增 logger 函数
```
const logger = (dir, err) => {
  const date = new Date()
  const fileName = format(date, '$1-$2-$3')
  const filePath = resolve(__dirname, `../log/${dir}/${fileName}.log`)
  let json = []
  const erro = {
    ...err,
    time: format(date, '$4:$5:$6')
  }
  if (fs.existsSync(filePath)) {
    let text = fs.readFileSync(filePath, 'utf-8')
    json = JSON.parse(text)
  }
  json.push(erro)
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2),)
}
```

修改 utils/util.js, 新增 format
```
// 时间格式化
export const format = (e, f = '$1-$2-$3') => {
  if (e.constructor !== Date) {
    e = new Date(e)
  }
  if (e.toString() === 'Invalid Date') throw new Error('请传入正确的时间!')
  let [y, m, d, hh, mm, ss] = [e.getFullYear(), e.getMonth() + 1, e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds()]
  if (m < 10) m = '0' + m
  if (d < 10) d = '0' + d
  if (hh < 10) hh = '0' + hh
  if (mm < 10) mm = '0' + mm
  if (ss < 10) ss = '0' + ss
  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`.replace(/(.+)-(.+)-(.+)-(.+)-(.+)-(.+)/, f)
}
```

引入format到router.hs
```
import { compose, isNull, format } from '../utils/util'

...


export class Route {
  
  ...

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
    app.on("error", (err, ctx) => {
      // 捕获异常记录错误日志
      logger('server', {
        token: ctx.header.authorization,
        text: err.message,
        routerUrl: ctx._matchedRoute,
        query: ctx.query,
        params: ctx.params
      })
    })
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
```

接下来，我们测试一下，修改Auth中，token 改为 tokentest, 故意修改命名
```
export const Auth = convert(async (ctx, next) => {
  const token = ctx.header.authorization
  ...
})
```

打开 http://localhost:8080/login

###### 注册

输入账号为 newCustom

输入密码为 123456 

点击注册, 会返回注册成功，并且账号密码清空

###### 登录

输入账号为 newCustom

输入密码为 123456 

点击登录, 会跳入到 home页面，说明登录成功！

之后会在 log/server 中发现新增2019-08-09.log日志文件
```
[
  {
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyLCJuYW1lIjpudWxsLCJpYXQiOjE1MzM2OTc1NzAsImV4cCI6MTUzNDMwMjM3MH0.wuGG96BdwMvZhETKWlIZePuQCE4ha9Sfsn4yy48W18s",
    "text": "token is not defined",
    "routerUrl": "/api/goods/getGoods",
    "query": {
      "name": "",
      "sort": ""
    },
    "params": {},
    "time": "15:33:15"
  }
]
```
简单的后端日志上报，已经写完，开发者可以根据自己需求，修改或者增强，接下来写前端的日志上报

还是修改 /decorator/router.js, 新增 erro 接口

```
export class Route {

  ...

  init() {

    ...

    router.get('/erro/setlog', async (ctx) => {
      const {query} = ctx
      logger('client', {...query})
      ctx.body = {
        code: ERR_SUCCESS
      }
    })
    app.on("error", (err, ctx) => {
      ...
    })
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}
```

测试完毕之后，记得把token1 恢复token

#### 前端的日志上报
前端加载一个全局的error事件处理函数可用于自动收集错误报告。

```
window.onerror = function (message, source, lineno, colno, error) {
  const params = []
  params.push(`message=${encodeURIComponent(message)}`)
  params.push(`source=${encodeURIComponent(source)}`)
  params.push(`lineno=${encodeURIComponent(lineno)}`)
  let img = new Image()
  img.src = window.location.origin + '/erro/setlog'  + '?' + params.join('&')
  return false
}
```
前端故意改个错误的代码(我修改的是main.js中，store改为 stores )，刷新 http://127.0.0.1:8080/home

查看 /log/client 目录下是否存在 2019-08-09.log日志文件
```
[
  {
    "message": "Uncaught ReferenceError: stores is not defined",
    "source": "http://127.0.0.1:8080/app.js",
    "lineno": "26947",
    "time": "15:57:24"
  }
]
```
