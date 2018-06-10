## 3.模型(一)
本文推荐数据库为mysql，ORM采用(Sequelize)[https://github.com/sequelize/sequelize]

#### 数据库安装
mysql 请自行查阅网上的安装教程，傻瓜式安装。

(本文不分配角色，用root链接mysql，数据库名为 lmq)


命令行执行(使用sequelize，必须依赖mysql2)
```
npm i -S sequelize mysql2
```
新建config文件夹，新建config.js
```
const config = {
  dialect: 'mysql',
  database: 'lmq',
  username: 'root',
  password: '123456',
  host: '127.0.0.1', 
  port: 3306
};

export default config
```
新建config/db.js 文件, 统一管理数据库链接
```
import Sequelize from 'sequelize'
import config from './config'

let sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
      charset: 'utf8',
      dialectOptions: {
          collate: 'utf8_general_ci'
      }
  }
})

export default sequelize
```

#### 模型定义
[Model](https://itbilu.com/nodejs/npm/V1PExztfb.html)相当于数据库中表，通过sequelize.define()或sequelize.import()方法创建

在db.js 新增
```
export const Entity = (name, option, option2) => {
  return sequelize.define(name, option, option2)
}
```
##### 数据类型
在定义模型，指定属性的类型（表的字段的[数据类型](https://itbilu.com/nodejs/npm/V1PExztfb.html#definition-dataType)）

在db.js 新增
```
let typeObject = {}
const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];
for (let type of TYPES) {
  typeObject[type] = Sequelize[type];
}
export const Type = typeObject
```
#### 模型创建（表）
根目录新建 models文件夹，创建 user.js

models/user.js
```
import { Entity, Type } from '../config/db'

export default Entity('user', {
  id: {
    type: Type.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键'
  },
  account: {
    type: Type.STRING(20),
    comment: '账号'
  },
  password: {
    type: Type.STRING(255),
    comment: '密码'
  },
  name: {
    type: Type.STRING(255),
    comment: '名称'
  },
  portraits: {
    type: Type.STRING(255),
    comment: '头像'
  },
  note: {
    type: Type.STRING(255),
    comment: '备注'
  }
}, {
  freezeTableName: true,
  timestamps: false
})
```
学过数据库大概能看单词就知道，或者看文档

这里有个坑点 ， freezeTableName必须设置为false，和表名一直，不然会自动加s 复数。

#### 同步模型到数据库
修改 db.js , 新增同步的函数 sync
```
export const sync = (e) => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      sequelize.sync({ force: true }).then(res => {
        console.log('To initialize the database successfully');
        resolve(res)
      }).catch(err => {
        reject(err);
      })
    } else {
      throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
    }
  })
}
```
修改 models/index.js  新增sync
```
import {sync} from '../config/db'
models.sync = sync
```

新建database文件夹，init-db.js
```
import models from '../models'

models.sync().then(res => {
  console.log('init db success！')
}).catch(error => {
  throw new Error(error)
})

console.log('please wait for init db')
```
新建 database/createDb.js  启动的文件
```
require('babel-core/register')()
require('babel-polyfill')
require('./init-db.js')
```
修改 package.json, 新增dbInit 脚本启动
```
"scripts": {
  "start": "node start",
  "dbInit": "node ./database/createDb"
}
```
命令行执行 node run dbInit
> init db success！

表初始化成功！