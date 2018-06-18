import * as verifyList from './verify'

// 电话校验
export const isTelCode = function (str) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
  return reg.test(str)
}

// 身份证校验
export const isIdCard = function (str) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(str)
}

// 数字校验
export const isNumber = function (str) {
  const reg = /^[0-9]+$/
  return reg.test(str)
}

// 身高校验
export const isHeight = function (str) {
  if (isNumber(str)) {
    str = Number(str)
    if (str > 100 && str < 220) return true
    return false
  }
  return false
}

// 体重校验
export const isWeight = function (str) {
  if (isNumber(str)) {
    str = Number(str)
    if (str > 30 && str < 150) return true
    return false
  }
  return false
}

export const verify = function (value, verifyKey) {
  if (typeof verifyKey === 'function') {
    return verifyKey(value)
  } else {
    if (!verifyList[verifyKey]) throw new Error('正则函数不存在啊!')
    return verifyList[verifyKey](value)
  }
}
