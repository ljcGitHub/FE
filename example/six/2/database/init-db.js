import models from '../models'
import * as data from './data-init'

models.sync().then(res => {
  console.log('init db success！')
  initData()
}).catch(error => {
  throw new Error(error)
})

const initData = async function () {
  try {
    for (let m of Object.keys(data)) {
      if (models[m]) {
        await models[m].bulkCreate(data[m], { ignoreDuplicates: true })
        console.log(`Table ${m} data initial success!`)
      }
    }
  } catch (err) {
    throw new Error(err);
  }
  process.exit()
}

console.log('please wait for init db')
