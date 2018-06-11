## 3.模型(二)

#### 路由，模型结合

model随着项目会越来越多，为了方便管理，新建 models/index.js
```
import fs from 'fs'

let files = fs.readdirSync(__dirname)

let js_files = files.filter((f) => {
  return f.endsWith('.js')
}, files)

let models = {}

for (let f of js_files) {
  let name = f.substring(0, f.length - 3)
  let m = require(__dirname + '/' + f).default
  models[name] = m
}

export default models
```
import和require有差异，需要加个default，具体可以脑补一下

引入models，修改 router/user.js
```
import {
  Controller,
  Get,
  Required
} from '../decorator/router'
import Models from '../models'

@Controller('/api')
export default class userRouter {
  @Get('/getUser')
  @Required({
    query: ['userid']
  })  
  async getUser(ctx, next) {
    const user = await Models.user.findOne()
    ctx.body = {
      code: 1,
      message: 'success',
      data: user
    }
  }
}
```
浏览器(postman) 输入

[http://localhost:3000/api/getUser?userid=1](http://localhost:3000/api/getUser?userid=1)

返回数据为：
> {"code":1,"message":"success","data":null}

##### 写个注册接口
注册接口为post请求(http://localhost:3000/api/logon)

修改 decorator/router.js  新增 post 请求
``` 
export const Post = setRouter('post')
```
修改 router/user.js  新增 logon 函数，并且先查询是否已经注册，在写入数据库
```
import {
  Controller,
  Get,
  Post,
  Required
} from '../decorator/router'
import Models from '../models'

@Controller('/api')
export default class userRouter {
  @Get('/getUser')
  @Required({
    query: ['userid']
  })  
  async getUser(ctx, next) {
    const user = await Models.user.findOne()
    ctx.body = {
      code: 1,
      message: 'success',
      data: user
    }
  }

  @Post('/logon')
  @Required({
    body: ['account', 'password']
  })  
  async logon(ctx, next) {
    const { account, password } = ctx.request.body
    const user = await Models.user.findOne({ where: { account } })
    if (!user) {
      await Models.user.upsert({ account, password })
      ctx.body = {
        code: 1,
        message: '注册成功！',
        data: {}
      }
    } else {
      ctx.body = {
        code: 0,
        message: '账号已经存在！',
        data: {}
      }
    }
  }
}
```

由于浏览器无法请求post，使用postman

url: http://localhost:3000/api/logon

method: post

params: {"account": "beijixing", "password": "123456"}

响应的结果为：

>  {"code":1,"message":"注册成功！","data":{}}

再次发送
>  {"code":0,"message":"账号已经存在！","data":{}}

#### 密码加密
推荐使用 bcryptjs 加密， MD5太容易解密了， 明文给后端发送密码不安全，后期可以上https

安装 bcryptjs
```
npm i -S bcryptjs
```
新增 utils/password.js , 加密解密的js  
```
import bcrypt from 'bcryptjs'

// 加密
export const encryption = (password) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

// 校验密码是否正确
export const verifyPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword)
```

修改 router/user.js 中 logon ， 并引入utils/password.js
```
import {
  Controller,
  Get,
  Post,
  Required
} from '../decorator/router'
import Models from '../models'
import { encryption } from '../utils/password.js'

@Controller('/api')
export default class userRouter {
  @Get('/getUser')
  @Required({
    query: ['userid']
  })  
  async getUser(ctx, next) {
    const user = await Models.user.findOne()
    ctx.body = {
      code: 1,
      message: 'success',
      data: user
    }
  }

  @Post('/logon')
  @Required({
    body: ['account', 'password']
  })  
  async logon(ctx, next) {
    const { account, password } = ctx.request.body
    const user = await Models.user.findOne({ where: { account } })
    let code,message
    if (!user) {
      const fleg = await Models.user.upsert({ account, password: encryption(password) })
      if (fleg) {
        code = 1
        message =  '注册成功！'
      } else {
        code = 0
        message =  '注册失败！'
      }
    } else {
      code = 0
      message =  '账号已经存在！'
    }
    ctx.body = {
      code,
      message,
      data: {}
    }
  }
}
```

由于浏览器无法请求post，使用postman

url: http://localhost:3000/api/logon

method: post

params: {"account": "bjx", "password": "123456"}

查看数据库表的数据，推荐navicat哈，能看到一串的
加密之后的密码： 
> $2a$10$tbCw3LZoUqOfmm1UwknhtOAZ8108q210gSpKku5d5XdJQMvxMv422

响应的结果为：

>  {"code":1,"message":"注册成功！","data":{}}
