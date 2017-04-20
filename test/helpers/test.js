const chai = require('chai')
const check = require('../../server/helpers/checkRepeated')
const userHelper = require('../../server/helpers/userHelper')
const expect = chai.expect

const jwt = require('jsonwebtoken')
const config = require('../../server/config/config.json')

describe('Helpers', () => {
  describe('checkRepeated', () => {
    const options = [
      { name: 'one',
        votes: [
          { voter: 'id_user_1', ip_address: '00.00.00.00' },
          { voter: 'id_user_2', ip_address: '00.00.00.01' }
        ]
      },
      { name: 'two',
        votes: [
          { voter: 'id_user_3', ip_address: '00.00.00.02' },
          { voter: 'id_user_4', ip_address: '00.00.00.03' }
        ]
      },
      { name: 'three',
        votes: []
      }
    ]

    it('it should check if an option is repeated', () => {
      const option = 'three'

      expect(check.isOptionRepeated(options, option)).to.be.equal(true)
    })
    it('it should check if an option is not repeated', () => {
      const option = 'four'

      expect(check.isOptionRepeated(options, option)).to.be.equal(false)
    })

    it('it should check if a vote is repeated base on name', () => {
      const user = 'id_user_1'
      const ipAdress = '00.00.00.05'

      expect(check.isVoteRepeated(options, user, ipAdress)).to.be.equal(true)
    })

    it('it should check if a vote is repeated base on ip adress', () => {
      const user = 'id_user_5'
      const ipAdress = '00.00.00.00'

      expect(check.isVoteRepeated(options, user, ipAdress)).to.be.equal(true)
    })

    it('it should check if a vote is not repeated', () => {
      const user = 'id_user_5'
      const ipAdress = '00.00.00.05'

      expect(check.isVoteRepeated(options, user, ipAdress)).to.be.equal(false)
    })
  })

  describe('userHelper', () => {
    it('it should decode jwt token', () => {
      const userData = {
        __v: 0,
        password: 'password',
        email: 'email',
        username: 'user',
        _id: '_id',
        iat: Math.floor(Date.now() / 1000)
      }

      const token = jwt.sign(userData, config.DATABASE.SECRET)
      const decoded = userHelper.decode(token)

      expect(decoded).to.be.eql(userData)
    })
  })
})
