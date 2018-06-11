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
    if (!user) {
      await Models.user.upsert({ account, password: encryption(password) })
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