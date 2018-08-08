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

// 时间格式化
export const format = (e, f = '$1-$2-$3') => {
  if (e.constructor !== Date) {
    e = new Date(e)
  }
  if (e.toString() === 'Invalid Date') throw new Error('请传入正确的时间!')
  let [y, m, d, hh, mm, ss] = [e.getFullYear(), e.getMonth() + 1, e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds()]
  if (m < 10) m = '0' + m
  if (d < 10) d = '0' + d
  if (hh < 10) hh = '0' + hh
  if (mm < 10) mm = '0' + mm
  if (ss < 10) ss = '0' + ss
  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`.replace(/(.+)-(.+)-(.+)-(.+)-(.+)-(.+)/, f)
}