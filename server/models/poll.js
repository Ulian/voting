var mongoose = require('mongoose')

module.exports = mongoose.model('Poll', {
  title: String,
  owner: String,
  created: { type: Date, default: Date.now },
  options: [{
    name: String,
    votes: [{
      voter: String,
      ip_address: String
    }]
  }]
})
