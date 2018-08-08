import axios from 'axios'

// 获取购物车的商品信息
export function getCart ({ userid }) {
  const url = '/api/cart/getCart'
  return axios.get(url, {
    params: {
      userid
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 添加商品到购物车
export function addCart ({ userid, goodsid }) {
  const url = '/api/cart/addCart'
  return axios.post(url, {
    userid, goodsid
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 删除购物车的商品信息
export function deleteCart ({ id }) {
  const url = '/api/cart/deleteCart'
  return axios.post(url, {
    id
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
