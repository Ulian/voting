const mongoose = require('mongoose')
const config = require('../config/config.json')

let dbMethods = {}

dbMethods.connect = () => {
  if (mongoose.connection.readyState !== 2) {
    mongoose.connect(`mongodb://${config.DATABASE.USER}:${config.DATABASE.PASS}@${config.DATABASE.HOST}`, {
      server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
      replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
    })
  }
}

module.exports = dbMethods
