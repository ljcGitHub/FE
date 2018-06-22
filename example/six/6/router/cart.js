import {
  Controller,
  Get,
  Post,
  Required,
  Auth
} from '../decorator/router'
import Models from '../models'
import { ERR_SUCCESS } from '../utils/http-status'

@Controller('/api/cart')
export default class userRouter {
  @Get('/getCart')
  @Required({
    query: ['userid']
  })
  @Auth
  async getCart(ctx, next) {
    const { userid } = ctx.request.query
    const cart = await Models.goods.findAll({
      include: [
        {
          association: Models.goods.hasOne(Models.cart, { sourceKey: 'id', foreignKey: 'goodsid' }),
          attributes: ['id'],
          where: {
            userid
          }
        }
      ]
    })
    let newCart = cart.map(c => {
      const _cart = c.dataValues
      return {
        goodsid: _cart.cart.id,
        ..._cart
      }
    })
    ctx.body = {
      code: ERR_SUCCESS,
      message: 'success',
      data: newCart
    }
  }

  @Post('/addCart')
  @Required({
    body: ['userid', 'goodsid']
  })
  @Auth
  async addCart(ctx, next) {
    const { userid, goodsid } = ctx.request.body
    const cart = await Models.cart.create({
      userid,
      goodsid,
      valid: 1
    })
    ctx.body = {
      code: ERR_SUCCESS,
      message: 'success',
      data: cart
    }
  }

  @Post('/deleteCart')
  @Required({
    body: ['id']
  })
  @Auth
  async deleteCart(ctx, next) {
    const { id } = ctx.request.body
    await Models.cart.destroy({
      where: {
        id
      },
    })
    ctx.body = {
      code: ERR_SUCCESS,
      message: 'success',
      data: {}
    }
  }
}