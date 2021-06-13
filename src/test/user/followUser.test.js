import {
  chai,
  app,
  validUser,
  Users,
  validToken
} from '../general/initializers'
import { tokenValidation } from '../general/token'
import Follows from '../../db/models/follow.model'
import mongoose from 'mongoose'

const followedUser = {
  _id: new mongoose.mongo.ObjectId(),
  firstName: 'Follower',
  lastName: 'User',
  email: 'followerUser@mail.com'
}

const baseUrl = '/api/v1/users'

describe(`FOLLOW USER: POST /${baseUrl}/:userId/follow`, () => {
  describe('FOLLOW USER SUCCESSFULLY', () => {
    before(async () => {
      await Users.create(validUser)
      await Users.create(followedUser)
    })
    after(async () => {
      await Users.deleteMany()
      await Follows.deleteMany()
    })

    it('should successfully allow user to follow another user', done => {
      chai
        .request(app)
        .post(`${baseUrl}/${followedUser._id}/follow`)
        .set('token', validToken)
        .end((err, res) => {
          res.status.should.equals(200)
          res.body.data.should.have.property('followership')
          res.body.data.followership.followedUserId.should.equals(
            followedUser._id.toHexString()
          )
          res.body.data.followership.followingUserId.should.equals(
            validUser._id.toHexString()
          )
          done()
        })
    })
  })

  describe('FOLLOW USER FAILURE', () => {
    describe('EXISTENT FOLLOWERSHIP', () => {
      before(async () => {
        await Follows.create({
          followedUserId: followedUser._id,
          followingUserId: validUser._id
        })
      })
      after(async () => {
        await Follows.deleteMany()
      })
      it('should return 409 error if user is already following requested user', done => {
        chai
          .request(app)
          .post(`${baseUrl}/${followedUser._id}/follow`)
          .set('token', validToken)
          .end((err, res) => {
            res.status.should.equals(409)
            res.body.should.have.property('status').to.equals('error')
            done()
          })
      })
    })

    describe('SELF FOLLOWERSHIP', () => {
      it('should return 400 error if user follows self', done => {
        chai
          .request(app)
          .post(`${baseUrl}/${validUser._id}/follow`)
          .set('token', validToken)
          .end((err, res) => {
            res.status.should.equals(400)
            res.body.should.have.property('status').to.equals('error')
            done()
          })
      })
    })

    tokenValidation(`${baseUrl}/${followedUser._id}/follow`, 'post')
  })
})
