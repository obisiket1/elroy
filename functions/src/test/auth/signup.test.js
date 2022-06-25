import chai from 'chai'
import sinon from 'sinon'
import chaiHttp from 'chai-http'
import Sinonchai from 'sinon-chai'
import Users from '../../db/models/user.model.js'
import userUtils from '../../utils/user.utils.js'

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
let user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@mail.com',
  password: unhashedPassword
}

const baseUrl = '/api/v1/auth/signup'

describe('SIGNUP', () => {
  describe('SUCCESSFUL SIGNUP', () => {
    afterEach(async () => {
      await Users.deleteOne({ email: user.email })
    })
    it('should signup user successfully', done => {
      chai
        .request(app)
        .post(baseUrl)
        .send(user)
        .end((err, res) => {
          res.should.have.status(201)
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

  describe('UNSUCCESSFUL SIGNUP', () => {
    describe('Invalid Request Params', () => {
      let request

      beforeEach(() => {
        request = chai.request(app).post(baseUrl)
      })
      it('should signup return error if first name is not provided', done => {
        user.firstName = undefined
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('First name is required')
          done()
        })
      })
      it('should signup return error if first name is empty string', done => {
        user.firstName = ''
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('First name cannot be empty')
          done()
        })
      })
      it('should signup return error if first name is not a string', done => {
        user.firstName = 5
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('First name should be a string')
          done()
        })
      })

      it('should signup return error if last name is not provided', done => {
        user.lastName = undefined
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Last name is required')
          done()
        })
      })
      it('should signup return error if last name is empty string', done => {
        user.lastName = ''
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Last name cannot be empty')
          done()
        })
      })
      it('should signup return error if last name is not a string', done => {
        user.lastName = 5
        request.send(user).end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('status').to.equals('error')
          res.body.should.have
            .property('errors')
            .to.include('Last name should be a string')
          done()
        })
      })

      it('should signup return error if email is not provided', done => {
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
      it('should signup return error if email is empty string', done => {
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
      it('should signup return error if email is not a string', done => {
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
      it('should signup return error if email is not a string', done => {
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

      it('should signup return error if password is not provided', done => {
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
      it('should signup return error if password is empty string', done => {
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
      it('should signup return error if password is not a string', done => {
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
      it('should signup return error if password length is less than 8 characters', done => {
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
  })
})
