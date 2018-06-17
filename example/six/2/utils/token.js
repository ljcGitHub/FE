import jwt from "jsonwebtoken"

const JWTKEY = 'I am Bei Ji' // 密钥

// 生成token
export const getToken = (content) => {
  return jwt.sign(content, JWTKEY, {
    expiresIn: 60 * 60 * 24 * 7  // 7天过期
  })
}

// 校验token
export const verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWTKEY, (err, decode) => {
      if (err) {  //  时间失效的时候/ 伪造的token 
        const msg = err.name === 'TokenExpiredError' ? 'token过期' : 'token无效'
        resolve({
          msg,
          verify: false
        })
      } else {
        resolve({
          msg: 'success',
          verify: true
        })
      }
    })
  })
}