const DATA_STORAGE = 'yjkGwdD'
const TOKEN_STORAGE = 'yjkGwdT'

export const getStorage = function () {
  return window.sessionStorage.getItem(DATA_STORAGE)
}

export const setStorage = function (d) {
  window.sessionStorage.setItem(DATA_STORAGE, JSON.stringify(d))
}

export const clearStorage = function (d) {
  return window.sessionStorage.removeItem(DATA_STORAGE)
}

export const getToken = function () {
  return JSON.parse(window.sessionStorage.getItem(TOKEN_STORAGE))
}

export const setToken = function (d) {
  return window.sessionStorage.setItem(TOKEN_STORAGE, JSON.stringify(d))
}

export const clearToken = function (d) {
  return window.sessionStorage.removeItem(TOKEN_STORAGE)
}
