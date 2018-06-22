# koa2 实践教程
[![node version][node-image]][node-url]

[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

#### 前言
koa是一门简单易学的web框架，优雅，简洁，自由。

本文参考了廖雪峰，Scott等大佬的代码，为了方便理解，部分中间件会改为手写功能去实现。

每个大章都有写好的项目代码，方便代码阅读和拷贝，每次修改代码，记得重启服务，后续会修改nodemon启动。

#### 项目
是基于koa2开发关于用户，商品管理，购物车的电商系统

为了方便理解，数据库表的设计非常low。。。


#### ES6

- [promise](http://es6.ruanyifeng.com/#docs/promise)
- [async](http://es6.ruanyifeng.com/#docs/async)
- [decorator](http://es6.ruanyifeng.com/#docs/decorator)

#### 库
- [koa2](https://github.com/koajs/koa) ([中文文档](http://www.koacn.com/) )
- [koa-router](https://github.com/alexmingoia/koa-router)
- [sequelize](https://github.com/sequelize/sequelize) ([中文文档](https://demopark.github.io/sequelize-docs-Zh-CN/))
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)([中文文档](https://segmentfault.com/a/1190000009494020))


#### 推荐koa入门资料
- [https://chenshenhai.github.io/koa2-note/](https://chenshenhai.github.io/koa2-note/)
- [https://www.liaoxuefeng.com](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001471087582981d6c0ea265bf241b59a04fa6f61d767f6000)


## 目录
* [1. ES6环境搭建](https://github.com/ljcGitHub/koa2-server/blob/master/example/one)
* [2. 路由](https://github.com/ljcGitHub/koa2-server/tree/master/example/two/1)
  * [2.1 koa-router使用](https://github.com/ljcGitHub/koa2-server/tree/master/example/two/1)
  * [2.2 decorator装饰路由](https://github.com/ljcGitHub/koa2-server/tree/master/example/two/2)
  * [2.3 路由支持中间件]( https://github.com/ljcGitHub/koa2-server/tree/dev/example/two/3)
* [3. 模型](https://github.com/ljcGitHub/koa2-server/tree/master/example/three/1)
  * [3.1 模型创建](https://github.com/ljcGitHub/koa2-server/tree/master/example/three/1)
  * [3.2 模型使用](https://github.com/ljcGitHub/koa2-server/tree/master/example/three/2)
* [4. JSON Web Tokens](https://github.com/ljcGitHub/koa2-server/tree/master/example/four/1)
  * [4.1 token生成](https://github.com/ljcGitHub/koa2-server/tree/master/example/four/1)
  * [4.2 token解析](https://github.com/ljcGitHub/koa2-server/tree/master/example/four/2)
* [5. 数据导入](https://github.com/ljcGitHub/koa2-server/tree/master/example/fifth)
* [6. 简单的电商项目](https://github.com/ljcGitHub/koa2-server/tree/master/example/six/1)
  * [6.1 数据库表](https://github.com/ljcGitHub/koa2-server/tree/master/example/six/1)
  * [6.2 Vue环境搭建](https://github.com/ljcGitHub/koa2-server/tree/master/example/six/2)
  * [6.3 token管理路由权限](https://github.com/ljcGitHub/koa2-server/tree/master/example/six/3)
  * [6.4 服务器/客户端 登录联调](https://github.com/ljcGitHub/koa2-server/tree/master/example/six/4)
  * [6.5 商品查询](https://github.com/ljcGitHub/koa2-server/tree/master/example/six/5)
  * [6.6 购物车收藏](https://github.com/ljcGitHub/koa2-server/tree/master/example/six/6)
* [7. PM2管理进程]()
* [8. 错误处理与日志上报]()
* [9. 服务器部署]()
* [10. nginx配置]()
* [11. 项目打包]()
* [12. 完结]()

 


