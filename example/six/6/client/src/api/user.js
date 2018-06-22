import axios from 'axios'

// 登录
export function login ({ account, password }) {
  const url = '/api/login'
  return axios.post(url, { account, password }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 注册
export function logon ({ account, password }) {
  const url = '/api/logon'
  return axios.post(url, { account, password }).then((res) => {
    return Promise.resolve(res.data)
  })
}
