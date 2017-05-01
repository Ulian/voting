const express = require('express')

let routes = express.Router()

routes.all('*', (req, res, next) => {
  let { language } = req.cookies
  if (language !== undefined) language = language.toLowerCase()

  const languages = res.getLocales()

  if (languages.indexOf(language) === -1) language = languages[0]
  res.setLocale(language || 'es')

  next()
})

const locale = require('../controllers/localeController')

routes.get('/locale/:lang', locale.set)

const account = require('../controllers/accountController')

routes.post('/register', account.register)
routes.post('/login', account.login)
routes.post('/profile', account.profile)

const poll = require('../controllers/pollController')

routes.get('/polls', poll.getPolls)
routes.post('/poll', poll.create)
routes.get('/poll/:id', poll.getById)
routes.post('/poll/:id', poll.addOption)
routes.delete('/poll/:id', poll.delete)
routes.post('/poll/:id/:option', poll.vote)

module.exports = routes
