export const chatMixin = {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    _format (e) {
      let targetDate = new Date(e)
      const toDay = new Date()
      let text = ''
      let toDayYear = toDay.getFullYear()
      let toDayMonth = toDay.getMonth() + 1
      let toDayDate = toDay.getDate()
      let year = targetDate.getFullYear()
      let month = targetDate.getMonth() + 1
      let date = targetDate.getDate()
      let hour = targetDate.getHours()
      let minute = targetDate.getMinutes()

      if (toDayYear === year && toDayMonth === month && date === toDayDate) {
        text = ''
      } else {
        toDay.setDate(toDayDate - 1)
        if (toDay.getFullYear() === year && (toDay.getMonth() + 1) === month && date === toDay.getDate()) {
          text = '昨天 '
        } else {
          month = month < 10 ? `0${month}` : month
          date = date < 10 ? `0${date}` : date
          text = `${year}-${month}-${date} `
        }
      }
      hour = hour < 10 ? `0${hour}` : hour
      minute = minute < 10 ? `0${minute}` : minute
      return `${text + hour}:${minute}`
    },
    isJson (e) {
      if (typeof e === 'string') {
        return JSON.parse(e)
      }
      return e
    }
  }
}

export const appointMixin = {
  methods: {
    getReserveTimeList (index = 10) {
      let arr = []
      for (let i = index; i < 22; i++) {
        if (i !== 12 || i !== 13) {
          arr.push({
            label: `${i}:00-${i + 1}:00`,
            value: String(i)
          })
        }
      }
      return arr
    }
  }
}
