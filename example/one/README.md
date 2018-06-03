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