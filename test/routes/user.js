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
const User = require('../../server/models/user')

before(() => {
  mockgoose.prepareStorage()
    .then(() => {
      database.connect()
    })
    .catch(error => {
      throw new Error(error)
    })
})

describe('Account controller', () => {
  describe('Register', () => {
    before((done) => {
      User.remove({}, (err) => {
        if (err) console.log(err)
        done()
      })
    })

    it('it should register an user', (done) => {
      let user = {
        username: 'username',
        email: 'email@email.com',
        password: 'password',
        passwordRepeat: 'password'
      }

      chai.request(server)
        .post('/api/register')
        .send(user)
        .end((error, res) => {
          should.not.exist(error)
          should.exist(res)
          res.should.have.status(201)
          res.body.should.be.a('object')
          done()
        })
    })

    it('it should not register an user with an useranme allready in use', (done) => {
      let user = {
        username: 'username',
        email: 'email2@email.com',
        password: 'password',
        passwordRepeat: 'password'
      }

      chai.request(server)
        .post('/api/register')
        .send(user)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not register an user with an email allready in use', (done) => {
      let user = {
        username: 'username2',
        email: 'email@email.com',
        password: 'password',
        passwordRepeat: 'password'
      }

      chai.request(server)
        .post('/api/register')
        .send(user)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not register an user without an username', (done) => {
      let user = {
        email: 'email@email.com',
        password: 'password',
        passwordRepeat: 'password'
      }

      chai.request(server)
        .post('/api/register')
        .send(user)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not register an user without an email', (done) => {
      let user = {
        username: 'username2',
        password: 'password',
        passwordRepeat: 'password'
      }

      chai.request(server)
        .post('/api/register')
        .send(user)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not register an user without an password', (done) => {
      let user = {
        username: 'username2',
        email: 'email@email.com',
        passwordRepeat: 'password'
      }

      chai.request(server)
        .post('/api/register')
        .send(user)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not register an user without an passwordRepeat', (done) => {
      let user = {
        username: 'username2',
        email: 'email@email.com',
        password: 'password'
      }

      chai.request(server)
        .post('/api/register')
        .send(user)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not register with a wrong passwordRepeat', (done) => {
      let user = {
        username: 'username3',
        email: 'email3@email.com',
        password: 'password',
        passwordRepeat: 'password_1'
      }

      chai.request(server)
        .post('/api/register')
        .send(user)
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
  describe('Login', () => {
    it('it should allow login', (done) => {
      let user = {
        login: 'username',
        password: 'password'
      }

      chai.request(server)
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.not.exist(error)
          should.exist(res)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not allow login with wrong username', (done) => {
      let user = {
        login: 'username2',
        password: 'password'
      }

      chai.request(server)
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not allow login with wrong password', (done) => {
      let user = {
        login: 'username',
        password: 'password_'
      }

      chai.request(server)
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not allow login with missing username', (done) => {
      let user = {
        password: 'password'
      }

      chai.request(server)
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.exist(error)
          should.exist(res)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not allow login with missing password', (done) => {
      let user = {
        login: 'username'
      }

      chai.request(server)
        .post('/api/login')
        .send(user)
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

  describe('Status', () => {
    it('it should return an user', (done) => {
      let user = {
        login: 'username',
        password: 'password'
      }

      const agent = chai.request.agent(server)
      agent
        .post('/api/login')
        .send(user)
        .end((error, res) => {
          should.not.exist(error)
          return agent.get('/api/status')
            .end((error, res) => {
              should.not.exist(error)
              should.exist(res)
              res.should.have.status('200')
              res.body.should.be.a('object')
              res.body.should.have.property('_id')
              res.body.should.have.property('username')
              res.body.should.have.property('email')
              res.body.should.have.property('polls')
              done()
            })
        })
    })

    it('it should not return an user if not logged', (done) => {
      chai.request(server)
        .get('/api/status')
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
