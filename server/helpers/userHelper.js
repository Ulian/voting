const jwt = require('jsonwebtoken')
const config = require('../config/config.json')

exports.decode = token => {
  const decoded = jwt.verify(token, config.DATABASE.SECRET)
  return (decoded._doc) ? decoded._doc : decoded
}
