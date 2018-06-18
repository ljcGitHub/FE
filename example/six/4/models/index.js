import fs from 'fs'
import {sync} from '../config/db'

let files = fs.readdirSync(__dirname)

let js_files = files.filter((f) => {
  return f.endsWith('.js')
}, files)

let models = {}

models.sync = sync

for (let f of js_files) {
  let name = f.substring(0, f.length - 3)
  let m = require(__dirname + '/' + f).default
  models[name] = m
}


export default models