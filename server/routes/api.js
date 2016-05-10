var express = require('express')
var moment = require('moment')

var CryptoJS = require('crypto-js')
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose')
var User = require('../models/user')
var Poll = require('../models/poll')

module.exports = (function() {

	var api = express.Router()

	api.post('/register', function(req, res) { // Create an account
	
		var username = req.body.username.toLowerCase()
		var email = req.body.email.toLowerCase()
		var password = req.body.password
		var passwordRepeat = req.body.passwordRepeat

		if(password !== passwordRepeat) {
			return res.status(400).json({'message': 'Password didnt match'})
		}
		
		if(password.length < 6) {
			return res.status(400).json({'message': 'Password need to be at least 6 characters'})
		}
		
		User.findOne({$or: [{username: username}, {email: email}]}, function(error, user) {
			if(error) throw error
			if(user) return res.status(400).json({'message': 'Username or email in use'})
			
			var account = new User({
				username: username,
				email: email,
				password: CryptoJS.AES.encrypt(password, process.env.PW_SECRET)
			})
			
			account.save(function(error) {
				if(error) throw error;
				res.status(201).json({'message': 'User created'})
			})
		})
		
	})
	
	api.post('/login', function(req, res) {  // Login to an account

		var login = req.body.login.toLowerCase()
		var password = req.body.password

		User.findOne({$or: [{username: login}, {email: login}]}, function(error, user) {
			if(error) throw error
			if(!user) return res.status(400).json({'message': 'Username or email not found'})

			var validPassword = CryptoJS.AES.decrypt(user.password, process.env.PW_SECRET).toString(CryptoJS.enc.Utf8)
			if(validPassword !== password) return res.status(400).json({'message': 'Incorrect password'})

			var token = jwt.sign(user, process.env.PW_SECRET, {
				expiresIn: '365d'
			});
			
			var protocol = (req.headers['x-forwarded-proto'] === 'https') ? true : false

			res.cookie('token', token, { expires: moment().add('1', 'y').toDate(), secure: protocol, httpOnly: true });
			
			res.status(200).json({'message': 'User logged in'})
		})
		
	})

	api.get('/status', function(req, res) {  // Get user info | TODO: and polls
	
		var token = req.cookies.token
		if(token !== undefined) {
			var user = getUser(req.cookies.token)
			Poll.find({ $query: {owner: user._id}, $orderby: { created: -1 }}, function(error, polls) {
				return res.status(200).json({_id: user._id, username: user.username, email: user.email, polls: polls})
			})
			return
		}
		res.status(400).json({'message': 'You need to be logged'})
		
	})

	api.get('/polls', function(req, res) {  // Get all polls
	
		Poll.find({ $query: {}, $orderby: { created: -1 }}, function(error, polls) {
			res.status(200).json(polls)
		})
		
	})

	api.post('/poll', function(req, res) {  // Create a poll
	
		var token = req.cookies.token
		if(token === undefined) {
			return res.status(400).json({'message': 'You need to be logged'})
		}
		var user = getUser(token)

		var title = req.body.title
		var owner = user._id
		var options = req.body.options
		var options_array = []

		options.split(',').map(function(option) {
			return options_array.push({ name: option })
		})
		
		if(title.length < 5) return res.status(400).json({'message': 'Title need to be at least 5 characters'})
		if(options_array.length < 2) return res.status(400).json({'message': 'The poll need to have at least 2 options'})
		if(mongoose.Types.ObjectId.isValid(owner) === false) return res.status(400).json({'message': 'Invalid owner'})
		
		var repeat = []
		options_array.forEach(function(current) {
			if(repeat.indexOf(current.name) === -1) repeat.push(current.name)
			else return res.status(400).json({'message': 'Option cannot be repeated'})
		})
		
		if(repeat.length !== options_array.length) return

		var poll = new Poll({
			title: title,
			owner: owner,
			options: options_array
		})

		poll.save(function(error) {
			if(error) return res.status(400).json({'message': 'An error ocurred'})
			res.status(201).json({'message': 'Poll created'})
		})
		
	})
	
	api.get('/poll/:id', function(req, res) {  // Get poll :id
	
		Poll.findOne({_id: req.params.id}, function(error, poll) {
			if(!poll || error) return res.status(400).json({'message': 'Poll not found'})
			res.status(200).json(poll)
		})
		
	})
	
	api.post('/poll/:id', function(req, res) {  // Add an option to a poll
	
		var option = req.body.option
		Poll.findOne({_id: req.params.id}, function(error, poll) {
			if(!poll || error) return res.status(400).json({'message': 'Poll not found'})
			if(checkRepeatedOption(poll.options, option) !== -1) return res.status(400).json({'message': 'Option cannot be repeated'})

			poll.options.push({name: option})
			
			poll.save(function(error) {
				if(error) return res.status(400).json({'message': 'An error ocurred'})
				res.status(201).json({'message': 'Option added'})
			})
		})
		
	})
	
	api.delete('/poll/:id', function(req, res) {  // Delete poll :id
	
		var token = req.cookies.token
		if(token != undefined) {
			var user = getUser(token)
			Poll.findOne({_id: req.params.id}, function(error, poll) {
				if(!poll || error) return res.status(400).json({'message': 'Invalid poll'})
				if(poll.owner !== user._id) return res.status(401).json({'message': 'It is not your poll'})
				Poll.findByIdAndRemove(poll._id, function(error, doc) {
					return res.status(200).json({'message': 'Poll removed'})
				})
			})
			return
		}
		res.status(401).json({'message': 'It is not your poll'})
		
	})
	
	api.post('/poll/:id/:option', function(req, res) { // Vote for an option
		var token = req.cookies.token;
		var option_voted = req.params.option
		var ip_address = req.headers['x-forwarded-for']
		var user = null
		
		if(token != undefined ) {
			user = getUser(token)
			user = user._id
		}

		Poll.findOne({_id: req.params.id}, function(error, poll) {
			if(!poll || error) return res.status(400).json({'message': 'Invalid poll'})
			if(checkRepeatedVote(poll.options, user, ip_address) !== -1) return res.status(400).json({'message': 'You already vote in this poll'})
			poll.options.forEach(function(option, index) {

				if(option.name === option_voted){

					poll.options[index].votes.push({
						voter: user,
						ip_address: ip_address
					})
					
					poll.save(function(error) {
						return res.status(201).json({'message': 'Vote added'})
					})

				}
			})
		})
	})
	
	return api
})()

function getUser(token) {
	var decoded = jwt.verify(token, process.env.PW_SECRET)
	return decoded._doc
}

function checkRepeatedOption(options, option) {
	var repeated = -1;
	options.forEach(function(item, index) {
		if(item.name === option) return repeated = index
	})
	return repeated
}

function checkRepeatedVote(options, user, ip) {
	var repeated = -1
	options.forEach(function(option, index) {
		option.votes.forEach(function(vote, index) {
			if((vote.voter === user && vote.voter !== null) || vote.ip_address === ip) return repeated = index
		})
	})
	return repeated
}