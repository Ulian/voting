const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser')
const i18n = require('i18n')
const config = require('./config/config')
const cors = require('cors')
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

app.use(express.static(path.join(__dirname, '../client/dist')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}))
app.use(i18n.init)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

const api = require('./routes/api')
app.use('/api', api)

const server = app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})

module.exports = server
