const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser')
const i18n = require('i18n')
const config = require('./config/config')

mongoose.Promise = global.Promise

if (!process.env.NODE_TEST) {
  const database = require('./controllers/databaseController')
  database.connect()
}

const port = process.env.PORT || config.SERVER.PORT

let app = express()

i18n.configure({
  locales: ['es', 'en'],
  directory: path.join(__dirname, '/locales')
})

app.use(express.static(path.join(__dirname, '../client')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(i18n.init)

const api = require('./routes/api')
app.use('/api', api)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

const server = app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})

module.exports = server
