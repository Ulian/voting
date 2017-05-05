const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

const config = require('../config/config.json')
const User = require('../models/user')
const Poll = require('../models/poll')

const userHelper = require('../helpers/userHelper')

const accountMethods = {}

accountMethods.register = (req, res) => {
  let { username, email, password, passwordConfirm } = req.body

  if (!username || !email || !password || !passwordConfirm) {
    return res.status(400).json({ message: res.__('ALL_REGISTRATION_DATA_REQUIRED') })
  }

  username = username.toLowerCase()
  email = email.toLowerCase()

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: res.__('PASSWORD_DID_NOT_MATCH') })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: res.__('PASSWORD_AT_LEAST_6_CHARS') })
  }

  password = CryptoJS.AES.encrypt(password, config.DATABASE.SECRET)

  User.findOne({ $or: [{username}, {email}] })
    .then(user => {
      if (user) return res.status(400).json({ message: res.__('DATA_IN_USE') })

      const account = new User({
        username,
        email,
        password
      })

      account.save()
        .then(() => {
          return res.status(201).json({ message: res.__('ACCOUNT_CREATED') })
        })
        .catch(error => {
          if (error) return res.status(400).json({ message: error })
        })
    })
    .catch(error => {
      if (error) return res.status(400).json({ message: error })
    })
}

accountMethods.login = (req, res) => {
  let { login, password } = req.body

  if (!login || !password) {
    return res.status(400).json({ message: res.__('ALL_LOGIN_DATA_REQUIRED') })
  }

  login = login.toLowerCase()

  User.findOne({$or: [{username: login}, {email: login}]})
    .then(user => {
      if (!user) return res.status(400).json({ message: res.__('ACCOUNT_NOT_FOUND') })

      const validPassword = CryptoJS.AES.decrypt(user.password, config.DATABASE.SECRET).toString(CryptoJS.enc.Utf8)
      if (validPassword !== password) return res.status(400).json({ message: res.__('INCORRECT_PASSWORD') })

      var token = jwt.sign(user, config.DATABASE.SECRET, {
        expiresIn: '365d'
      })

      return res.status(200).json({
        message: res.__('USER_LOGGED_IN'),
        token: token
      })
    })
    .catch(error => {
      if (error) return res.status(400).json({ message: error })
    })
}

accountMethods.profile = (req, res) => {
  const { token } = req.body
  if (token !== undefined && token !== null) {
    const user = userHelper.decode(token)

    Poll.find({ $query: {owner: user._id}, $orderby: { created: -1 } })
      .then(polls => {
        return res.status(200).json({_id: user._id, username: user.username, email: user.email, polls: polls})
      })
      .catch(error => {
        if (error) return res.status(400).json({ message: error })
      })
  } else return res.status(400).json({ message: res.__('NEED_TO_BE_LOGGED_STATUS') })
}

module.exports = accountMethods
