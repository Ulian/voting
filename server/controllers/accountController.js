const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const config = require('../config/config.json')
const User = require('../models/user')
const Poll = require('../models/poll')

const userHelper = require('../helpers/userHelper')

const accountMethods = {}

accountMethods.register = (req, res) => {
  let { username, email, password, passwordRepeat } = req.body

  if (!username || !email || !password || !passwordRepeat) {
    return res.status(400).json({'message': 'An email, username and password (with confirm) are required'})
  }

  username = username.toLowerCase()
  email = email.toLowerCase()

  if (password !== passwordRepeat) {
    return res.status(400).json({'message': 'Password didnt match'})
  }

  if (password.length < 6) {
    return res.status(400).json({'message': 'Password need to be at least 6 characters'})
  }

  User.findOne({ $or: [{username}, {email}] })
    .then(user => {
      if (user) return res.status(400).json({'message': 'Username or email in use'})

      const account = new User({
        username,
        email,
        password: CryptoJS.AES.encrypt(password, config.DATABASE.SECRET)
      })

      account.save()
        .then(() => {
          return res.status(201).json({'message': 'User created'})
        })
        .catch(error => {
          return res.status(400).json({'message': error})
        })
    })
    .catch(error => {
      return res.status(400).json({'message': error})
    })
}

accountMethods.login = (req, res) => {
  let { login, password } = req.body

  if (!login || !password) {
    return res.status(400).json({'message': 'An email/username and password are required'})
  }

  login = login.toLowerCase()

  User.findOne({$or: [{username: login}, {email: login}]})
    .then(user => {
      if (!user) return res.status(400).json({'message': 'Username or email not found'})

      const validPassword = CryptoJS.AES.decrypt(user.password, config.DATABASE.SECRET).toString(CryptoJS.enc.Utf8)
      if (validPassword !== password) return res.status(400).json({'message': 'Incorrect password'})

      var token = jwt.sign(user, config.DATABASE.SECRET, {
        expiresIn: '365d'
      })

      var protocol = (req.headers['x-forwarded-proto'] === 'https')

      res.cookie('token', token, { expires: moment().add('1', 'y').toDate(), secure: protocol, httpOnly: true })

      return res.status(200).json({'message': 'User logged in'})
    })
    .catch(error => {
      return res.status(400).json({'message': error})
    })
}

accountMethods.status = (req, res) => {
  const { token } = req.cookies
  if (token !== undefined) {
    const user = userHelper.decode(token)

    Poll.find({ $query: {owner: user._id}, $orderby: { created: -1 } })
      .then(polls => {
        return res.status(200).json({_id: user._id, username: user.username, email: user.email, polls: polls})
      })
      .catch(error => {
        return res.status(400).json({'message': error})
      })
  } else return res.status(400).json({'message': 'You need to be logged'})
}

module.exports = accountMethods
