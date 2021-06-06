import chai from 'chai'
import sinon from 'sinon'
import chaiHttp from 'chai-http'
import Sinonchai from 'sinon-chai'
import mongoose from 'mongoose'
import userUtils from '../../utils/user.utils'

import app from '../../index'

chai.should()
chai.use(Sinonchai)
chai.use(chaiHttp)

const unhashedPassword = '12345678'
let user

userUtils.encryptPassword(unhashedPassword).then(password => {
  user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    password,
    role: '5fc8f4b99d1e3023e4942152'
  }
})

const invalidToken = 'invalid.jwt.token'
const staffToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '608ebc0a8673c637b45fbc42',
  'Staff User'
)
const adminToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '608ebc218673c637b45fbc43',
  'Administrator User'
)

const baseUrl = '/api/v1/auth'

describe('No Matching Endpoint', () => {
  describe('* Unknown ', () => {
    it('should throw 404 error when endpoint is not found', done => {
      chai
        .request(app)
        .post('/api/v1/AuthMiddleware/none')
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })
})

describe('SIGNUP', () => {
  
})
