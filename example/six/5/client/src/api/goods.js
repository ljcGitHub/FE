import axios from 'axios'

// 获取商品
export function getGoods ({ name, sort }) {
  const url = '/api/goods/getGoods'
  return axios.get(url, {
    params: {
      name,
      sort
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
