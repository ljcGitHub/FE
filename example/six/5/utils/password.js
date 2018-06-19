import bcrypt from 'bcryptjs'

// 加密
export const encryption = (password) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

// 校验密码是否正确
export const verifyPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword)

