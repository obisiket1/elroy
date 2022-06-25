import chai from 'chai'
import sinon from 'sinon'
import chaiHttp from 'chai-http'
import Sinonchai from 'sinon-chai'
import Users from '../../db/models/user.model.js'
import userUtils from '../../utils/user.utils.js'
import mongoose from 'mongoose'

import app from '../../index.js'

chai.should()
chai.use(Sinonchai)
chai.use(chaiHttp)

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

const unhashedPassword = '12345678'
let validUser = {
  _id: new mongoose.mongo.ObjectId(),
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@mail.com',
  password: unhashedPassword
}
let user = { ...validUser }
const token = userUtils.generateToken(user._id, user.firstName)
let hashedPassword
;(async () => {
  hashedPassword = await userUtils.encryptPassword(unhashedPassword)
})()
const invalidToken = 'invalid.jwt.token'

const baseUrl = '/api/v1/auth/login'

describe('LOGIN', () => {
  describe('SUCCESSFUL LOGIN', () => {
    beforeEach(async () => {
      await Users.create({
        ...user,
        password: hashedPassword
      })
    })
    afterEach(async () => {
      await Users.deleteOne({ email: user.email })
    })
    it('should login user successfully', done => {
      chai
        .request(app)
        .post(baseUrl)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.data.should.have.property('token')
          res.body.data.should.have.property('user')
          res.body.data.user.should.have.property('firstName').to.equals('John')
          res.body.data.user.should.have.property('lastName').to.equals('Doe')
          res.body.data.user.should.have
            .property('email')
            .to.equals('johndoe@mail.com')
          res.body.data.user.should.not.have.property('password')
          done()
        })
    })
  })

  describe('UNSUCCESSFUL LOGIN', () => {
    describe('Invalid Request Params', () => {
      let request

      beforeEach(() => {
        request = chai.request(app).post(baseUrl)
        // user = { ...validUser }
        // done()
      })

      it('should login return error if email is not provided', done => {
        user.email = undefined
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Email is required')
          done()
        })
      })
      it('should login return error if email is empty string', done => {
        user.email = ''
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Email cannot be empty')
          done()
        })
      })
      it('should login return error if email is not a string', done => {
        user.email = 5
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Email should be a string')
          done()
        })
      })
      it('should login return error if email is not a string', done => {
        user.email = 'john@'
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Email is not a valid email address')
          done()
        })
      })

      it('should login return error if password is not provided', done => {
        user.password = undefined
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Password is required')
          done()
        })
      })
      it('should login return error if password is empty string', done => {
        user.password = ''
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Password cannot be empty')
          done()
        })
      })
      it('should login return error if password is not a string', done => {
        user.password = 5
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Password should be a string')
          done()
        })
      })
      it('should login return error if password is less than 8 digits', done => {
        user.password = '1234'
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Password length should be at least 8 characters')
          done()
        })
      })
    })

    describe('INCORRECT CREDENTIALS', () => {
      beforeEach(() => {
        user = { ...validUser }
      })
      it('should return 404 error if user is not signed up', done => {
        chai
          .request(app)
          .post(baseUrl)
          .send(user)
          .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('status').to.equals('error')
            res.body.should.have
              .property('error')
              .to.include('Incorrect email or password')
            done()
          })
      })
    })
  })
})
