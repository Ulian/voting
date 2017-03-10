const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const config = require('../config/config.json')
const User = require('../models/user')
const Poll = require('../models/poll')

const accountMethods = {}

accountMethods.register = (req, res) => {
  const username = req.body.username.toLowerCase()
  const email = req.body.email.toLowerCase()
  const password = req.body.password
  const passwordRepeat = req.body.passwordRepeat

  if (password !== passwordRepeat) {
    return res.status(400).json({'message': 'Password didnt match'})
  }

  if (password.length < 6) {
    return res.status(400).json({'message': 'Password need to be at least 6 characters'})
  }

  User.findOne({ $or: [{username: username}, {email: email}] })
    .then(user => {
      if (user) return res.status(400).json({'message': 'Username or email in use'})

      const account = new User({
        username: username,
        email: email,
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
  const login = req.body.login.toLowerCase()
  const password = req.body.password

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
  const token = req.cookies.token
  if (token !== undefined) {
    const user = getUser(req.cookies.token)
    Poll.find({ $query: {owner: user._id}, $orderby: { created: -1 } })
      .then(polls => {
        return res.status(200).json({_id: user._id, username: user.username, email: user.email, polls: polls})
      })
      .catch(error => {
        return res.status(400).json({'message': error})
      })
  } else return res.status(400).json({'message': 'You need to be logged'})
}

let getUser = token => {
  const decoded = jwt.verify(token, config.DATABASE.SECRET)
  return decoded._doc
}

module.exports = accountMethods