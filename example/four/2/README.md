## JSON Web Tokens(二)

#### 统一管理 token
在路由的章节中，已经描述Required函数的扩展，本文扩展Auth 函数，支持 token的校验

客户端请求接口，需要请求登录接口 http://localhost:3000/api/login 获取相应的 token 值

本文token会放入请求接口的请求头
```
headers: {
  Authorization: `Bearer ${token}`
}
```

修改 decorator/router.js 
```
import { verifyToken } from '../utils/token'

export const Auth = convert(async (ctx, next) => {
  const token = ctx.header.authorization
  let code = 1, message = '', data = {}
  if(token && token.indexOf('Bearer ') > -1){
    const t = await verifyToken(token.split('Bearer ')[1])
    if (!t.verify) {
      code = 0
      message = t.msg
    }
  } else {
    code = 0
    message = 'permission denied'
  }
  if (code === 0) {
    ctx.body = {
      code,
      message,
      data: {}
    }
    return
  }
  await next()
})
```

修改 router/user.js  中 getUser 函数

引入 Auth
```
import {
  Controller,
  Get,
  Post,
  Auth,
  Required
} from '../decorator/router'

@Controller('/api')
export default class userRouter {
  @Get('/getUser')
  @Required({
    query: ['userid']
  })
  @Auth
  async getUser(ctx, next) {
    const user = await Models.user.findOne()
    ctx.body = {
      code: 1,
      message: 'success',
      data: user
    }
  }
    
  ...    
    
}
```
#### 获取token

打开postMan，输入下面参数

- url: http://localhost:3000/api/login
- method: post
- params: {"account": "bjx", "password": "123456"}

获取相应的 token 为 eyJhbGciOiJIUzI1NiIsInR...

###### 再次打开postMan，输入下面参数, 配置请求头的参数

- url: http://localhost:3000/api/getUser?userid=1
- method: get
- headers: {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR..."}


返回正确的数据：
```
{
    "code": 1,
    "message": "success",
    "data": {
        "id": 1,
        "account": "lijc",
        "password": "123456",
        "name": null,
        "portraits": null,
        "note": null
    }
}
```
请求头Authorization的token传入错误的token，会返回错误的数据，并提示token无效
```
{
    "code": 0,
    "message": "token无效",
    "data": {}
}
```
请求头去掉，会返回错误的数据，提示权限不足
```
{
    "code": 0,
    "message": "permission denied",
    "data": {}
}
```