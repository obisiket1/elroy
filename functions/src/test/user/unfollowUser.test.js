import { chai, app, validUser, validToken } from '../general/initializers.js'
import { tokenValidation } from '../general/token.js'
import Follows from '../../db/models/follow.model.js'
import mongoose from 'mongoose'

const followedUser = {
  _id: new mongoose.mongo.ObjectId(),
  firstName: 'Follower',
  lastName: 'User',
  email: 'followerUser@mail.com'
}

const baseUrl = '/api/v1/users'

describe(`UNFOLLOW USER: DELETE /${baseUrl}/:userId/unfollow`, () => {
  describe('UNFOLLOW USER SUCCESSFULLY', () => {
    before(async () => {
      await Follows.create({
        followedUserId: followedUser._id,
        followingUserId: validUser._id
      })
    })
    after(async () => {
      await Follows.deleteMany()
    })

    it('should successfully allow user to unfollow a followed user', done => {
      chai
        .request(app)
        .delete(`${baseUrl}/${followedUser._id}/unfollow`)
        .set('token', validToken)
        .end((err, res) => {
          res.status.should.equals(200)
          res.body.data.should.have.property('message')
          done()
        })
    })
  })

  describe('UNFOLLOW USER FAILURE', () => {
    describe('INEXISTENT FOLLOWERSHIP', () => {
      it('should return 404 error if user is not following requested user', done => {
        chai
          .request(app)
          .delete(`${baseUrl}/${followedUser._id}/unfollow`)
          .set('token', validToken)
          .end((err, res) => {
            res.status.should.equals(404)
            res.body.should.have.property('status').to.equals('error')
            done()
          })
      })
    })

    tokenValidation(`${baseUrl}/${followedUser._id}/unfollow`, 'delete')
  })
})
