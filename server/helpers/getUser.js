const jwt = require('jsonwebtoken')
const config = require('../config/config.json')

exports.getUser = token => {
  const decoded = jwt.verify(token, config.DATABASE.SECRET)
  return decoded._doc
}
