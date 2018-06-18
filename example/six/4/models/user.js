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
