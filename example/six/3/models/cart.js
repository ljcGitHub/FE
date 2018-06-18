import { Entity, Type } from '../config/db'

export default Entity('cart', {
  id: {
    type: Type.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键'
  },
  userid: {
    type: Type.STRING(255),
    comment: '用户id'
  },
  goodsid: {
    type: Type.STRING(255),
    comment: '商品id'
  },
  valid: {
    type: Type.BOOLEAN(),
    allowNull: false,
    defaultValue: true,
    comment: '是否有效'
  },
  note: {
    type: Type.STRING(255),
    comment: '备注'
  }
}, {
  freezeTableName: true,
  timestamps: false
})
