import { Entity, Type } from '../config/db'

export default Entity('goods', {
  id: {
    type: Type.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键'
  },
  name: {
    type: Type.STRING(255),
    comment: '商品名称'
  },
  price: {
    type: Type.DOUBLE(10, 2),
    comment: '价格'
  },
  image: {
    type: Type.STRING(255),
    comment: '图片'
  },
  note: {
    type: Type.STRING(255),
    comment: '备注'
  }
}, {
  freezeTableName: true,
  timestamps: false
})
