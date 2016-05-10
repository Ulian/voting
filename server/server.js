var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var path = require('path')
//var passport = require('passport')
//var CryptoJS = require('crypto-js')
//var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000

mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds011732.mlab.com:11732/voting')

var app = express()

app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

var api = require('./routes/api')
app.use('/api', api)

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP, function() {
	console.log('Listen at port ' + process.env.OPENSHIFT_NODEJS_PORT)
})