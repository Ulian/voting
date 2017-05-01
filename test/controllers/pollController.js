const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should()

chai.use(chaiHttp)

const Mongoose = require('mongoose').Mongoose
const mongoose = new Mongoose()

const Mockgoose = require('mockgoose').Mockgoose
const mockgoose = new Mockgoose(mongoose)

const server = require('../../server/index')
const database = require('../../server/controllers/databaseController')
const Poll = require('../../server/models/poll')

before(() => {
  mockgoose.prepareStorage()
    .then(() => {
      database.connect()
    })
    .catch(error => {
      throw new Error(error)
    })
})

describe('Poll controller', () => {
  let validId

  before((done) => {
    Poll.remove({}, (err) => {
      if (err) console.log(err)
      done()
    })
  })

  describe('Create', () => {
    it('it should add a poll', (done) => {
      const poll = {
        title: 'Poll!',
        options: 'one,two'
      }

      const user = {
        login: 'username',
        password: 'password'
      }

      const agent = chai.request.agent(server)
      agent
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          poll.token = res.body.token
          should.not.exist(error)
          return agent.post('/api/poll')
            .send(poll)
            .end((error, res) => {
              should.not.exist(error)
              should.exist(res)
              res.should.have.status(201)
              res.body.should.be.a('object')
              res.body.should.have.property('message')
              done()
            })
        })
    })

    it('it should not add a poll without login', (done) => {
      const poll = {
        title: 'Poll!',
        options: 'one,two'
      }

      chai.request(server)
        .post('/api/poll')
        .send(poll)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not add a poll with less than 5 characters in title', (done) => {
      const poll = {
        title: 'Poll',
        options: 'one,two'
      }

      const user = {
        login: 'username',
        password: 'password'
      }

      const agent = chai.request.agent(server)
      agent
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.not.exist(error)
          return agent.post('/api/poll')
            .send(poll)
            .end((error, res) => {
              should.exist(error)
              should.exist(res)
              res.should.have.status(400)
              res.body.should.be.a('object')
              res.body.should.have.property('message')
              done()
            })
        })
    })

    it('it should not add a poll with less than 2 options', (done) => {
      const poll = {
        title: 'Poll!',
        options: 'one'
      }

      const user = {
        login: 'username',
        password: 'password'
      }

      const agent = chai.request.agent(server)
      agent
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.not.exist(error)
          return agent.post('/api/poll')
            .send(poll)
            .end((error, res) => {
              should.exist(error)
              should.exist(res)
              res.should.have.status(400)
              res.body.should.be.a('object')
              res.body.should.have.property('message')
              done()
            })
        })
    })

    it('it should not add a poll with an empty option', (done) => {
      const poll = {
        title: 'Poll!',
        options: 'one,'
      }

      const user = {
        login: 'username',
        password: 'password'
      }

      const agent = chai.request.agent(server)
      agent
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.not.exist(error)
          return agent.post('/api/poll')
            .send(poll)
            .end((error, res) => {
              should.exist(error)
              should.exist(res)
              res.should.have.status(400)
              res.body.should.be.a('object')
              res.body.should.have.property('message')
              done()
            })
        })
    })

    it('it should not add a poll with a repeated option', (done) => {
      const poll = {
        title: 'Poll!',
        options: 'one,one'
      }

      const user = {
        login: 'username',
        password: 'password'
      }

      const agent = chai.request.agent(server)
      agent
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.not.exist(error)
          return agent.post('/api/poll')
            .send(poll)
            .end((error, res) => {
              should.exist(error)
              should.exist(res)
              res.should.have.status(400)
              res.body.should.be.a('object')
              res.body.should.have.property('message')
              done()
            })
        })
    })
  })

  describe('Get all', () => {
    it('it should get all polls', (done) => {
      chai.request(server)
        .get('/api/polls')
        .end((error, res) => {
          should.not.exist(error)
          should.exist(res)
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.forEach(item => {
            item.should.have.property('__v')
            item.should.have.property('_id')
            item.should.have.property('title')
            item.should.have.property('owner')
            item.should.have.property('options')
            item.should.have.property('created')
            validId = item._id
          })
          done()
        })
    })
  })

  describe('Get by ID', () => {
    it('it should get poll by validId', (done) => {
      chai.request(server)
        .get(`/api/poll/${validId}`)
        .end((error, res) => {
          should.not.exist(error)
          should.exist(res)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('__v')
          res.body.should.have.property('_id')
          res.body.should.have.property('title')
          res.body.should.have.property('owner')
          res.body.should.have.property('options')
          res.body.should.have.property('created')
          done()
        })
    })

    it('it should not get any poll with invalid id', (done) => {
      chai.request(server)
        .get('/api/poll/0')
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })
  })

  describe('Add option', () => {
    it('it should add a new option', (done) => {
      let option = {
        option: 'three'
      }
      chai.request(server)
        .post(`/api/poll/${validId}`)
        .send(option)
        .end((error, res) => {
          should.not.exist(error)
          should.exist(res)
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not add a repeated option', (done) => {
      let option = {
        option: 'two'
      }
      chai.request(server)
        .post(`/api/poll/${validId}`)
        .send(option)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not accept a mission option', (done) => {
      chai.request(server)
        .post(`/api/poll/${validId}`)
        .send({})
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not accept an invalid id', (done) => {
      chai.request(server)
        .post(`/api/poll/0`)
        .send({})
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })
  })

  describe('Vote option', () => {
    it('it should not allow to vote a wrong option', (done) => {
      chai.request(server)
        .post(`/api/poll/${validId}/four`)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not allow to vote a invalid id poll', (done) => {
      chai.request(server)
        .post(`/api/poll/0/two`)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should allow to vote', (done) => {
      chai.request(server)
        .post(`/api/poll/${validId}/two`)
        .end((error, res) => {
          should.not.exist(error)
          should.exist(res)
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not allow to vote twice', (done) => {
      chai.request(server)
        .post(`/api/poll/${validId}/two`)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })
  })

  describe('Delete', () => {
    it('it should not allow to remove a poll without being logged', (done) => {
      chai.request(server)
        .delete(`/api/poll/${validId}`)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not allow to remove a poll that you don\'t own', (done) => {
      const user = {
        login: 'username5',
        password: 'password'
      }

      const agent = chai.request.agent(server)
      agent
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.not.exist(error)
          return agent.delete(`/api/poll/${validId}`)
            .send({ token: res.body.token })
            .end((error, res) => {
              should.exist(error)
              should.exist(res)
              res.should.have.status(401)
              res.body.should.be.a('object')
              res.body.should.have.property('message')
              done()
            })
        })
    })

    it('it should not allow to remove a poll with an invalid id', (done) => {
      const user = {
        login: 'username',
        password: 'password'
      }

      const agent = chai.request.agent(server)
      agent
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.not.exist(error)
          return agent.delete(`/api/poll/0`)
            .send({ token: res.body.token })
            .end((error, res) => {
              should.exist(error)
              should.exist(res)
              res.should.have.status(400)
              res.body.should.be.a('object')
              res.body.should.have.property('message')
              done()
            })
        })
    })

    it('it should allow to remove your poll', (done) => {
      const user = {
        login: 'username',
        password: 'password'
      }

      const agent = chai.request.agent(server)
      agent
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.not.exist(error)
          return agent.delete(`/api/poll/${validId}`)
            .send({ token: res.body.token })
            .end((error, res) => {
              should.not.exist(error)
              should.exist(res)
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('message')
              done()
            })
        })
    })
  })
})
