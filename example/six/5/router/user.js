import {
  Controller,
  Get,
  Post,
  Auth,
  Required
} from '../decorator/router'
import Models from '../models'
import { encryption, verifyPassword } from '../utils/password'
import { getToken } from '../utils/token'
import { ERR_SUCCESS, ERR_ERROR } from '../utils/http-status'

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
      code: ERR_SUCCESS,
      message: 'success',
      data: user
    }
  }

  @Post('/login')
  @Required({
    body: ['account', 'password']
  })
  async login(ctx, next) {
    const { account, password } = ctx.request.body
    const user = await Models.user.findOne({ where: { account } })
    let code = ERR_ERROR, message = '账号不存在', data = {}
    if (user) {
      const pwdMatchFlag = verifyPassword(password, user.password)
      if (pwdMatchFlag) {
        const { id, name } = user
        code = ERR_SUCCESS
        message = '登录成功！'
        data = {
          token: getToken({ id, name }),
          ...user.dataValues
        }
      } else {
        code = ERR_ERROR
        message = '密码不正确！'
      }
    }
    ctx.body = {
      code,
      message,
      data
    }
  }

  @Post('/logon')
  @Required({
    body: ['account', 'password']
  })
  async logon(ctx, next) {
    const { account, password } = ctx.request.body
    const user = await Models.user.findOne({ where: { account } })
    let code, message
    if (!user) {
      const fleg = await Models.user.upsert({ account, password: encryption(password) })
      if (fleg) {
        code = ERR_SUCCESS
        message = '注册成功！'
      } else {
        code = ERR_ERROR
        message = '注册失败！'
      }
    } else {
      code = ERR_ERROR
      message = '账号已经存在！'
    }
    ctx.body = {
      code,
      message,
      data: {}
    }
  }
}