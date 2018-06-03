# koa2 实践教程

#### 前言
koa是一门简单易学的web框架，优雅，简洁，自由。

本文参考了廖雪峰，Scott等大佬的代码，为了方便理解，部分中间件会改为手写功能去实现。

node版本为[8.9.3](https://nodejs.org/zh-cn/),请自行升级，每个大章都有写好的项目代码，方便代码阅读和拷贝。

#### 项目
是基于koa2开发关于用户，商品管理，购物车的电商系统

为了方便理解，数据库表的设计非常low。。。


#### ES6

- [promise](http://es6.ruanyifeng.com/#docs/promise)
- [async](http://es6.ruanyifeng.com/#docs/async)
- [decorator](http://es6.ruanyifeng.com/#docs/decorator)

#### 库
- [koa2](https://github.com/koajs/koa) ([中文文档](http://www.koacn.com/) )
- [koa-router](httpshttps://github.com/alexmingoia/koa-router)
- [sequelize](https://github.com/sequelize/sequelize) ([中文文档](https://demopark.github.io/sequelize-docs-Zh-CN/))
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)([中文文档](https://segmentfault.com/a/1190000009494020))


#### 推荐koa入门资料
- [https://chenshenhai.github.io/koa2-note/](https://chenshenhai.github.io/koa2-note/)
- [https://www.liaoxuefeng.com](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001471087582981d6c0ea265bf241b59a04fa6f61d767f6000)


## 1.ES6环境搭建
关于node，npm安装和使用，看网上的教程

安装koa
```
npm i -S koa 
```
新建app.js
```
import Koa from 'koa'

const app = new Koa()

app.listen(3000, () => {
  console.log('koa2 is starting at port 3000')
})
```
以上是熟悉的es6语法，由于高版本node大部分支持es6语法，部分需要配置babel实现。


安装babel
```
npm i -D babel-core babel-polyfill
```

新建start.js
```
require('babel-core/register')()
require('babel-polyfill')
require('./app.js')
```
新增package.json的scripts，让脚本启动，当然你也可以直接
node start也可以,以下是修改之后的package.json
```
{
  "name": "koa2",
  "version": "1.0.0",
  "description": "",
  "main": "server/index.js",
  "scripts": {},
  "author": "lijc",
  "license": "ISC",
  "scripts": {
    "start": "node start"
  },
  "dependencies": {
    "koa": "^2.5.1"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-polyfill": "^6.26.0"
  }
}
```
命令行执行npm run start(直接npm start也可以，run可以省略)
```
npm run start
```
会报错，还是不支持（[你需要脑补一下babel配置](https://www.babeljs.cn/docs/setup/#installation)）

新建.babelrc
```
{
  "presets": ["env"]
}
```
安装babel启动插件
```
npm install babel-preset-env --save-dev
```

再次执行 npm run start

控制台打印  koa2 is starting at port 3000

配置es6环境成功，还需要配置plugins [ decorators（装饰器）](https://www.babeljs.cn/docs/plugins/)

修改app.js,新增以下内容，
```
@testable
class MyTestableClass {}
function testable(target) {
  target.isTestable = '我是阮老师的decorators示例';
}
console.log(MyTestableClass.isTestable)
```
修改 .babelrc（新增依赖的加载的插件）,这有个小坑，插件顺序要注意
```
{
  "plugins": [
    "transform-decorators-legacy",
    "transform-class-properties"
  ]
}
```
命令行执行加载依赖的插件
```
npm i -D babel-plugin-transform-decorators-legacy babel-plugin-transform-class-properties
```

命令行执行 npm run start 

能在控制台看到下面的句子，说明decorators语法已经支持

> 我是阮老师的decorators示例



