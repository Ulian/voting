const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser')

const config = require('./config/config')

mongoose.Promise = global.Promise

if (!process.env.NODE_TEST) {
  const database = require('./controllers/databaseController')
  database.connect()
}

const port = config.SERVER.PORT
const ip = config.SERVER.IP

let app = express()

app.use(express.static(path.join(__dirname, '../client')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

const api = require('./routes/api')
app.use('/api', api)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

const server = app.listen(port, ip, () => {
  console.log(`Server running at ${ip}:${port}`)
})

module.exports = server
