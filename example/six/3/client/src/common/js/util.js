const formatConst = '$1-$2-$3' // 时间格式
const MINUTE = 60 * 1000 // 1分
const HOUR = MINUTE * 60 // 1小时
const DAY = HOUR * 24 // 1天
const MONTH_LIST = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

// 月份
export const formatMonth = (e) => {
  if (e.constructor !== Date) {
    e = new Date(e)
  }
  if (e.toString() === 'Invalid Date') throw new Error('请传入正确的时间!')
  let m = e.getMonth()
  return MONTH_LIST[m]
}

// 时间格式化
export const format = (e, f = formatConst) => {
  if (isNull(e)) {
    return e
  }
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

// 金额格式化
export const formatCurrency = (num, float) => {
  if (isNull(num)) {
    return num
  }
  if (typeof num === 'object' && !num) num = '0'
  if (typeof num !== 'string') num = num.toString()
  if (/[^0-9.]/.test(num)) {
    num = '0'
    console.error('数字不为正数！')
  }
  num = num.replace(/^(\d*)$/, '$1.')
  num = (num + '00').replace(/(\d*\.\d\d)\d*/, '$1')
  num = num.replace('.', ',')
  var re = /(\d)(\d{3},)/
  while (re.test(num)) { num = num.replace(re, '$1,$2') }
  num = num.replace(/,(\d\d)$/, '.$1')
  num = num.replace(/^\./, '0.')
  if (float) {
    return num.substr(0, num.length - 3)
  }
  return num
}

// 消息时间格式化
export const msgFormat = (e) => {
  let nowDate = new Date()
  let targetDate = new Date(e)
  const c = nowDate - targetDate
  if (c < MINUTE) {
    return `${Math.ceil(c / 1000)}秒之前`
  } else if (c < HOUR && c >= MINUTE) {
    return `${Math.floor(c / MINUTE)}分钟之前`
  } else if (c < DAY && c >= HOUR) {
    return `${Math.floor(c / HOUR)}小时之前`
  } else if (c >= DAY) {
    return `${Math.floor(c / DAY)}天之前`
  }
}

// 性别格式化
export const genderFormat = (e) => {
  switch (e) {
    case 1:
      return '男'
    case 2:
      return '女'
    default:
      return '未知'
  }
}

// 有无格式化
export const hasFormat = (e) => {
  e = parseInt(e)
  switch (e) {
    case 0:
      return '有'
    case 1:
      return '无'
    default:
      return ''
  }
}

// 支付方式格式化
export const billFormat = (e) => {
  e = parseInt(e)
  switch (e) {
    case 0:
      return '钱包支出'
    case 1:
      return '微信支付'
    case 2:
      return '支付宝'
    default:
      return '银联'
  }
}

// 预约状态格式化
export const reserveStateFormat = (e) => {
  e = parseInt(e)
  switch (e) {
    case -1:
      return '已取消'
    case 0:
      return '未分配顾问'
    case 1:
      return '待咨询'
    case 2:
      return '已完成'
    default:
      return '-'
  }
}
// 快速获取数组
export const getKeyArr = (value, key, targetArr) => {
  for (let j = 0; j < targetArr.length; j++) {
    const t = targetArr[j]
    if (t[key] === value) {
      return {
        index: j,
        object: t
      }
    }
  }
  return {
    index: -1
  }
}

// 消息列表格式化
export const clMessageFormat = (msg) => {
  const type = msg.objectName
  switch (type) {
    case 'RC:TxtMsg': // 文字消息
      if (window.RongIMLib) {
        if (msg.content.content) {
          return window.RongIMLib.RongIMEmoji.emojiToHTML(msg.content.content)
        }
        return ''
      }
      return msg.content.content
    case 'RC:ImgMsg': // 图片消息
      return '[图片]'
    case 'app:orderMessage': // 订单消息
      return '最新的 [订单消息]'
    case 'app:appointmentMessage': // 预约申请
      return '最新的 [预约申请]'
    case 'app:effectFeedbackMessage': // 效果反馈
      return '最新的 [效果反馈]'
    case 'RC:VcMsg': // 语音
      return '[语音]'
    default:
      return '设备不支持的类型内容'
  }
}

// 快速排序
export const quicksort = (arr, key) => {
  if (arr.length <= 1) {
    return arr
  }
  let proiindex = Math.floor(arr.length / 2)
  let proift = arr.splice(proiindex, 1)[0]
  let left = []
  let right = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] >= proift[key]) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quicksort(left, key).concat([proift], quicksort(right, key))
}

// 处理级联的字典
export const dictKeyGetArray = ({ value, targetArray, valueKey }, callback) => {
  if (value === null || value === undefined) {
    callback && callback()
    return
  }
  const values = value.split(',')
  values.forEach(v => {
    targetArray.forEach(arr => {
      if (arr[valueKey] == v) { /* eslint-disable-line eqeqeq */
        callback && callback(arr)
      }
    })
  })
}

// 城市递归 转为 element的级联数据结构
export const recursion = (arr) => {
  let newArr = []
  for (let a of arr) {
    let o = {}
    let c = a.citylist || a.arealist
    o.value = a.name
    o.label = a.name
    if (c && c.length > 0) {
      o.children = recursion(c)
    }
    newArr.push(o)
  }
  return newArr
}

export const getPhoneStr = (str) => {
  const list = str.split('&')
  let obj = {}
  for (let item of list) {
    let n = item.split('=')
    let key = n[0]
    let value = n[1]
    obj[key] = value
  }
  return obj
}

// 是否为空
export const isNull = (value) => {
  if (value === null || value === undefined || value === '') {
    return true
  }
  if (value instanceof Array && value.length === 0) {
    return true
  }
  return false
}

// base64并压缩
export const convertImgToBase64 = (url, rate = 4) => {
  return new Promise(function (resolve, reject) {
    const canvas = document.createElement('CANVAS')
    const ctx = canvas.getContext('2d')
    let img = document.createElement('img')
    img.onload = () => {
      const width = img.width
      const height = img.height
      // 按比例压缩4倍
      const rate = (width < height ? width / height : height / width) / 4
      canvas.width = width * rate
      canvas.height = height * rate
      ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate)
      let u = canvas.toDataURL('image/png')
      u = u.replace(/^data:image\/(gif|png|jpg|jpeg|bmp);base64,/, '')
      resolve(u)
    }
    img.src = url
  })
}
