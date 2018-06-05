import {
  Controller,
  Get
} from '../decorator/router'

@Controller('/api')
export default class userRouter {
  @Get('/getUser')
  async getUser(ctx, next) {
    ctx.body = {
      code: 1,
      message: 'success',
      data: {}
    }
  }
}