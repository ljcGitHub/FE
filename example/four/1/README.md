## JSON Web Tokens(一)

#### token

关于token，推荐看阮老师的[OAuth](http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html),讲的很透彻

本文才用 [jsonwebtoken](https://segmentfault.com/a/1190000009494020) (第三方token生成和校验的库)

#### 安装 jsonwebtoken
```
npm i -S jsonwebtoken
```
新建utils/token.js，实现生成，校验token
```
import jwt from "jsonwebtoken"

const JWTKEY = 'I am Bei Ji' // 密钥

// 生成token
export const getToken = (content) => {
  return jwt.sign(content, JWTKEY, {
    expiresIn: 60 * 60 * 24 * 7  // 7天过期
  })
}

// 校验token
export const verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWTKEY, (err, decode) => {
      if (err) {  //  时间失效的时候/ 伪造的token 
        const msg = err.name === 'TokenExpiredError' ? 'token过期' : 'token无效'
        resolve({
          msg,
          verify: false
        })
      } else {
        resolve({
          msg: 'success',
          verify: true
        })
      }
    })
  })
}
```

##### 写个登录接口
登录接口为post请求(http://localhost:3000/api/login)

修改 router/user.js， 和getUser logon 一样,在 userRouter 中新增 login
```
@Post('/login')
@Required({
body: ['account', 'password']
})  
async login(ctx, next) {
}
```
引入 getToken(生成token)和密码校验（verifyPassword）
```
import { encryption, verifyPassword } from '../utils/password'
import { getToken } from '../utils/token'
```
修改之后的 login
```
@Post('/login')
@Required({
body: ['account', 'password']
})  
async login(ctx, next) {
    const { account, password } = ctx.request.body
    const user = await Models.user.findOne({ where: { account } })
    let code = 0, message = '账号不存在', data ={}
    if (user) {
      const pwdMatchFlag = verifyPassword(password, user.password)
      if (pwdMatchFlag) {
        const { id, name } = user
        code = 1
        message = '登录成功！'
        data = {
          token: getToken({ id, name }),
          ...user.dataValues
        }
      } else {
        code = 0
        message = '密码不正确！'
      }
    }
    ctx.body = {
      code,
      message,
      data
    }
}
```
然后修改之后启动，报错！没想到吧，哈哈。

由于扩展运算符(...)  在node的es6环境中不支持，需要babel转义

修改根目录下的 .babelrc 配置文件, 增加 [ stage-3](https://www.babeljs.cn/docs/plugins/preset-stage-3) 提案
```
{
  "presets": ["env", "stage-3"],
  "plugins": [
    "transform-decorators-legacy",
    "transform-class-properties"
  ]
}
```
安装依赖的 包
```
npm i -D babel-preset-stage-3
```
再次运行环境，使用postman, 上一节注册了 bjx 账号

url: http://localhost:3000/api/login

method: post

params: {"account": "bjx", "password": "123456"}
```
{
    "code": 1,
    "message": "登录成功！",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6bnVsbCwiaWF0IjoxNTI4ODEyMzY2LCJleHAiOjE1Mjk0MTcxNjZ9.eJpQevCD9kEWkqCE7McMLdfz-JiwXS_RZRScPvjK1Aw",
        "id": 1,
        "account": "bjx",
        "password": "$2a$10$WiUYd0GDj29qgZa2NE5QvOM93aAt9bV0qbOoUZz7sdTO0Mhczppgy",
        "name": null,
        "portraits": null,
        "note": null
    }
}
```