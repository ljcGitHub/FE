import {
  Controller,
  Get,
  Required
} from '../decorator/router'

@Controller('/api')
export default class userRouter {
  @Get('/getUser')
  @Required({
    query: ['userid']
  })  
  async getUser(ctx, next) {
    ctx.body = {
      code: 1,
      message: 'success',
      data: {}
    }
  }
}