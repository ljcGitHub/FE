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

let typeObject = {}
const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];
for (let type of TYPES) {
  typeObject[type] = Sequelize[type];
}
export const Type = typeObject

export const Entity = (name, option, option2) => {
  return sequelize.define(name, option, option2)
}