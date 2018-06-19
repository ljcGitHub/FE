import Sequelize from 'sequelize'
import {
  Controller,
  Get,
  Auth
} from '../decorator/router'
import Models from '../models'
import { ERR_SUCCESS } from '../utils/http-status'

@Controller('/api/goods')
export default class userRouter {
  @Get('/getGoods')
  @Auth
  async getGoods(ctx, next) {
    const { name, sort } = ctx.query
    let order = []
    if (sort === 'asc') {
      order.push(['price', 'ASC'])
    } else if (sort === 'desc') {
      order.push(['price', 'DESC'])
    }
    const user = await Models.goods.findAll({
      where: {
        name: { [Sequelize.Op.like]: `%${name}%` }
      },
      order: order
    })
    ctx.body = {
      code: ERR_SUCCESS,
      message: 'success',
      data: user
    }
  }
}