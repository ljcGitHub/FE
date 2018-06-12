import models from '../models'

models.sync().then(res => {
  console.log('init db success！')
}).catch(error => {
  throw new Error(error)
})

console.log('please wait for init db')
