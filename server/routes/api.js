const express = require('express')

let routes = express.Router()

const account = require('../controllers/accountController')

routes.post('/register', account.register)
routes.post('/login', account.login)
routes.get('/status', account.status)

const poll = require('../controllers/pollController')

routes.get('/polls', poll.getPolls)
routes.post('/poll', poll.create)
routes.get('/poll/:id', poll.getById)
routes.post('/poll/:id', poll.addOption)
routes.delete('/poll/:id', poll.delete)
routes.post('/poll/:id/:option', poll.vote)

module.exports = routes
