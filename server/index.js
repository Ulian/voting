const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser')

const config = require('./config/config.json')

const port = config.SERVER.PORT
const ip = config.SERVER.IP

mongoose.connect(`mongodb://${config.DATABASE.USER}:${config.DATABASE.PASS}@${config.DATABASE.HOST}`, {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
})
mongoose.Promise = global.Promise

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

app.listen(port, ip, () => {
  console.log(`Server running at ${ip}:${port}`)
})
