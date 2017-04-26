const requestIp = require('request-ip')
const mongoose = require('mongoose')

const Poll = require('../models/poll')

const userHelper = require('../helpers/userHelper')
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
    return res.status(400).json({ message: res.__('NEED_TO_BE_LOGGED') })
  }

  const user = userHelper.decode(token)

  const { title, options } = req.body
  const owner = user._id
  const optionsArray = []

  options.split(',').map(name => {
    return optionsArray.push({ name })
  })

  if (title.length < 5) return res.status(400).json({ message: res.__('TITLE_AT_LEAST_5_CHARS') })
  if (optionsArray.length < 2) return res.status(400).json({ message: res.__('POLL_AT_LEAST_2_OPTIONS') })
  if (mongoose.Types.ObjectId.isValid(owner) === false) return res.status(400).json({ message: res.__('NOT_VALID_OWNER') })

  let repeat = []
  optionsArray.forEach(current => {
    if (repeat.indexOf(current.name) === -1) repeat.push(current.name)
    else return res.status(400).json({ message: res.__('OPTION_CANNOT_BE_REPEATED') })
  })

  if (repeat.length !== optionsArray.length) return

  const poll = new Poll({
    title,
    owner,
    options: optionsArray
  })

  poll.save()
    .then(() => {
      return res.status(201).json({ message: res.__('POLL_CREATED') })
    })
    .catch(error => {
      if (error) return res.status(400).json({ message: error })
    })
}

pollMethods.getById = (req, res) => {
  Poll.findOne({_id: req.params.id})
    .then(poll => {
      if (!poll) return res.status(400).json({ message: res.__('POLL_NOT_FOUND') })
      return res.status(200).json(poll)
    })
    .catch(error => {
      if (error) return res.status(400).json({ message: error })
    })
}

pollMethods.addOption = (req, res) => {
  const { option: name } = req.body

  if (name === undefined) {
    return res.status(400).json({ message: res.__('OPTION_TEXT_NEEDED') })
  }

  Poll.findOne({_id: req.params.id})
    .then(poll => {
      if (!poll) return res.status(400).json({ message: res.__('POLL_NOT_FOUND') })
      if (checkRepeatedHelper.isOptionRepeated(poll.options, name)) return res.status(400).json({ message: res.__('OPTION_CANNOT_BE_REPEATED') })

      poll.options.push({
        name
      })

      poll.save(function (error) {
        if (error) return res.status(400).json({ message: error })
        return res.status(201).json({ message: res.__('OPTION_ADDED') })
      })
    })
    .catch(error => {
      if (error) return res.status(400).json({ message: error })
    })
}

pollMethods.delete = (req, res) => {
  const { token } = req.cookies

  if (token !== undefined) {
    const user = userHelper.decode(token)

    Poll.findOne({_id: req.params.id})
      .then(poll => {
        if (!poll) return res.status(400).json({ message: res.__('POLL_NOT_FOUND') })
        if (poll.owner !== user._id) return res.status(401).json({ message: res.__('NOT_YOUR_POLL') })

        Poll.findByIdAndRemove(poll._id)
          .then(() => {
            return res.status(200).json({ message: res.__('POLL_REMOVED') })
          })
          .catch(error => {
            if (error) return res.status(400).json({ message: error })
          })
      })
      .catch(error => {
        if (error) return res.status(400).json({ message: error })
      })
  } else return res.status(400).json({ message: res.__('NEED_TO_BE_LOGGED') })
}

pollMethods.vote = (req, res) => {
  const { token } = req.cookies
  const { option: optionVoted } = req.params
  const ipAddress = requestIp.getClientIp(req)
  let user = null

  if (token !== undefined) {
    user = userHelper.decode(token)
    user = user._id
  }

  let voteAdded

  Poll.findOne({_id: req.params.id})
    .then(poll => {
      if (!poll) return res.status(400).json({ message: res.__('POLL_NOT_FOUND') })
      if (checkRepeatedHelper.isVoteRepeated(poll.options, user, ipAddress)) return res.status(400).json({ message: res.__('ALREADY_VOTE') })

      poll.options.forEach((option, index) => {
        if (option.name === optionVoted) {
          poll.options[index].votes.push({
            voter: user,
            ip_address: ipAddress
          })

          voteAdded = true

          poll.save()
            .then(() => {
              return res.status(201).json({ message: res.__('VOTE_ADDED') })
            })
            .catch(error => {
              if (error) return res.status(400).json({ message: error })
            })
        }
      })

      if (voteAdded !== true) return res.status(400).json({ message: res.__('OPTION_NOT_FOUND') })
    })
    .catch(error => {
      if (error) return res.status(400).json({ message: error })
    })
}

module.exports = pollMethods
