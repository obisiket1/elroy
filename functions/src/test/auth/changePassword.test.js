// import chai from 'chai'
// import sinon from 'sinon'
// import chaiHttp from 'chai-http'
// import Sinonchai from 'sinon-chai'
// import Users from '../../db/models/user.model.js'
// import userUtils from '../../utils/user.utils.js'
// import mongoose from 'mongoose'
// import { tokenValidation } from '../general/token.js'

// import app from '../../index'

// chai.should()
// chai.use(Sinonchai)
// chai.use(chaiHttp)

// let user = {
//   _id: new mongoose.mongo.ObjectId(),
//   firstName: 'John',
//   lastName: 'Doe',
//   email: 'johndoe@mail.com',
//   password: '12345678'
// }
// const token = userUtils.generateToken(user._id, user.firstName)
// const inexistentUserToken = userUtils.generateToken(
//   new mongoose.mongo.ObjectId(),
//   user.firstName
// )

// const baseUrl = '/api/v1/auth/change-password'

// describe('PASSWORD CHANGE', () => {
//   describe('CHANGE PASSWORD SUCCESSFULLY', () => {
//     before(async () => {
//       await Users.create(user)
//     })
//     after(async () => {
//       await Users.findByIdAndDelete(user._id)
//     })
//     it('it should successfully change user password', done => {
//       chai
//         .request(app)
//         .patch(baseUrl)
//         .set('token', token)
//         .send({ newPassword: 'newpassword', oldPassword: 'oldPassword' })
//         .end((err, res) => {
//           res.status.should.equals(200)
//           res.body.should.have.property('data')
//           res.body.data.should.have.property('message')
//           done()
//         })
//     })
//   })

//   describe('CHANGE PASSWORD FAILURE', () => {
//     describe('INVALID PARAMETER', () => {
//       let request, password

//       beforeEach(() => {
//         request = chai
//           .request(app)
//           .patch(baseUrl)
//           .set('token', token)
//       })
//       it('should return error if password is not provided', done => {
//         password = undefined
//         request.send({ password }).end((err, res) => {
//           res.should.have.status(400)
//           res.body.should.have.property('status').to.equals('error')
//           res.body.should.have.property('errors')
//           done()
//         })
//       })
//       it('should return error if password is empty string', done => {
//         password = ''
//         request.send({ password }).end((err, res) => {
//           res.should.have.status(400)
//           res.body.should.have.property('status').to.equals('error')
//           res.body.should.have.property('errors')
//           done()
//         })
//       })
//       it('should return error if password is not a string', done => {
//         password = 5
//         request.send({ password }).end((err, res) => {
//           res.should.have.status(400)
//           res.body.should.have.property('status').to.equals('error')
//           res.body.should.have.property('errors')
//           done()
//         })
//       })
//       it('should return error if password is not a string', done => {
//         password = '1234'
//         request.send({ password }).end((err, res) => {
//           res.should.have.status(400)
//           res.body.should.have.property('status').to.equals('error')
//           res.body.should.have.property('errors')
//           done()
//         })
//       })
//     })

//     describe('INEXISTENT USER', () => {
//       it('should return 404 error if user does not exist', done => {
//         chai
//           .request(app)
//           .patch(baseUrl)
//           .set('token', inexistentUserToken)
//           .send({ password: '12345678' })
//           .end((err, res) => {
//             res.status.should.equals(404)
//             res.body.should.have.property('status').to.equals('error')
//             done()
//           })
//       })
//     })

//     tokenValidation(baseUrl, 'patch')
//   })
// })
