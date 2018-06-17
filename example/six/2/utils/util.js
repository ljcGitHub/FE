export const compose = function (arr, item) {
  if (item) {
    if (arr && arr.constructor === Array) {
      arr.unshift(item)
    } else {
      let a = arr
      arr = [item, a]
    }
  } else {
    if (arr && arr.constructor === Array) return arr
    let a = arr
    arr = [a]
  }
  return arr
}

export const isNull = function (value) {
  if (value === null || value === undefined || value === '') {
    return true
  }
  if (value instanceof Array && value.length === 0) {
    return true
  }
  return false
}