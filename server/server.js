var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var path = require('path')

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT
var ipadress = process.env.IP || process.env.OPENSHIFT_NODEJS_IP

var cookieParser = require('cookie-parser')

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

app.listen(port, ipadress, function() {
	console.log('Server at ' + ipadress + ':' + port)
})