import {
  chai,
  app,
  validUser,
  Users,
  validToken
} from '../general/initializers'
import Follows from '../../db/models/follow.model'
import mongoose from 'mongoose'

const baseUrl = '/api/v1/users/'

describe(`FETCH USER FOLLOWERS`, () => {
  describe('FETCH FOLLOWERS SUCCESSFULLY', () => {
    let followers = new Array(3).fill('-').map((_, index) => {
      return {
        _id: new mongoose.mongo.ObjectId(),
        firstName: `Follower${index}`,
        lastName: `User${index}`,
        email: `followerUser${index}@mail.com`
      }
    })
    before(async () => {
      await Users.insertMany([...followers, validUser])
      await Follows.insertMany(
        followers.map(follower => ({
          followingUserId: follower._id,
          followedUserId: validUser._id
        }))
      )
    })
    after(async () => {
      await Users.deleteMany()
      await Follows.deleteMany()
    })

    it("should get user's followers successfully", done => {
      chai
        .request(app)
        .get(`${baseUrl}${validUser._id}/followers`)
        .end((err, res) => {
          res.status.should.equals(200)
          res.body.data.should.have.property('followers')
          followers.forEach((follower, index) => {
            if (index === 3) return
            let followingUser = res.body.data.followers[index].followingUserId
            followingUser.firstName.should.equals(follower.firstName)
            followingUser.lastName.should.equals(follower.lastName)
            followingUser.email.should.equals(follower.email)
          })
          done()
        })
    })
  })

  describe('GET FOLLOWERS FAILURE', () => {
    it('should return 404 error if user does not exist', done => {
      chai
        .request(app)
        .get(`${baseUrl}${validUser._id}/followers`)
        .end((err, res) => {
          res.status.should.equals(404)
          res.body.should.have.property('status').to.equals('error')
          done()
        })
    })
  })
})
