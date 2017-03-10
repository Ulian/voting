const mongoose = require('mongoose')

const Poll = require('../models/poll')

const userHelper = require('../helpers/getUser')
const checkRepeatedHelper = require('../helpers/checkRepeated')

const pollMethods = {}

pollMethods.getPolls = (req, res) => {
  Poll.find({ $query: {}, $orderby: { created: -1 } })
    .then(polls => {
      return res.status(200).json(polls)
    })
    .catch(error => {
      return res.status(400).json(error)
    })
}

pollMethods.create = (req, res) => {
  const { token } = req.cookies
  if (token === undefined) {
    return res.status(400).json({'message': 'You need to be logged'})
  }

  const user = userHelper.getUser(token)

  const { title, options } = req.body
  const owner = user._id
  const optionsArray = []

  options.split(',').map(option => {
    return optionsArray.push({ name: option })
  })

  if (title.length < 5) return res.status(400).json({'message': 'Title need to be at least 5 characters'})
  if (optionsArray.length < 2) return res.status(400).json({'message': 'The poll need to have at least 2 options'})
  if (mongoose.Types.ObjectId.isValid(owner) === false) return res.status(400).json({'message': 'Invalid owner'})

  let repeat = []
  optionsArray.forEach(current => {
    if (repeat.indexOf(current.name) === -1) repeat.push(current.name)
    else return res.status(400).json({'message': 'Option cannot be repeated'})
  })

  if (repeat.length !== optionsArray.length) return

  const poll = new Poll({
    title,
    owner,
    options: optionsArray
  })

  poll.save()
    .then(() => {
      return res.status(201).json({'message': 'Poll created'})
    })
    .catch(error => {
      if (error) return res.status(400).json({'message': error})
    })
}

pollMethods.getById = (req, res) => {
  Poll.findOne({_id: req.params.id})
    .then(poll => {
      if (!poll) return res.status(400).json({'message': 'Poll not found'})
      return res.status(200).json(poll)
    })
    .catch(error => {
      if (error) return res.status(400).json({'message': error})
    })
}

pollMethods.addOption = (req, res) => {
  const { option: name } = req.body
  Poll.findOne({_id: req.params.id})
    .then(poll => {
      if (!poll) return res.status(400).json({'message': 'Poll not found'})
      if (checkRepeatedHelper.option(poll.options, name) !== -1) return res.status(400).json({'message': 'Option cannot be repeated'})

      poll.options.push({
        name
      })

      poll.save(function (error) {
        if (error) return res.status(400).json({'message': 'An error ocurred'})
        return res.status(201).json({'message': 'Option added'})
      })
    })
    .catch(error => {
      if (error) return res.status(400).json({'message': error})
    })
}

pollMethods.delete = (req, res) => {
  const { token } = req.cookies

  if (token !== undefined) {
    const user = userHelper.getUser(token)

    Poll.findOne({_id: req.params.id})
      .then(poll => {
        if (!poll) return res.status(400).json({'message': 'Invalid poll'})
        if (poll.owner !== user._id) return res.status(401).json({'message': 'It is not your poll'})

        Poll.findByIdAndRemove(poll._id)
          .then(() => {
            return res.status(200).json({'message': 'Poll removed'})
          })
          .catch(error => {
            if (error) return res.status(400).json({'message': error})
          })
      })
      .catch(error => {
        if (error) return res.status(400).json({'message': error})
      })
  }
}

pollMethods.vote = (req, res) => {
  const { token } = req.cookies
  const { option: optionVoted } = req.params
  const { ipAddress } = req.headers['x-forwarded-for']
  let user = null

  if (token !== undefined) {
    user = userHelper.getUser(token)
    user = user._id
  }

  Poll.findOne({_id: req.params.id})
    .then(poll => {
      if (!poll) return res.status(400).json({'message': 'Invalid poll'})
      if (checkRepeatedHelper.vote(poll.options, user, ipAddress) !== -1) return res.status(400).json({'message': 'You already vote in this poll'})

      poll.options.forEach((option, index) => {
        if (option.name === optionVoted) {
          poll.options[index].votes.push({
            voter: user,
            ip_address: ipAddress
          })

          poll.save()
            .then(() => {
              return res.status(201).json({'message': 'Vote added'})
            })
            .catch(error => {
              if (error) return res.status(400).json({'message': error})
            })
        }
      })
    })
    .catch(error => {
      if (error) return res.status(400).json({'message': error})
    })
}

module.exports = pollMethods
