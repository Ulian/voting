var mongoose = require('mongoose')

module.exports = mongoose.model('User', {
    username: { type:String, unique: true},
    email: { type:String, unique: true},
    password: String,
})