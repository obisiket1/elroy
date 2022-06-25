import {
    chai,
    app,
    validUser,
    Users,
    validToken
  } from '../general/initializers.js'
  import Follows from '../../db/models/follow.model.js'
  import mongoose from 'mongoose'
  
  const baseUrl = '/api/v1/users/'
  
  describe(`FETCH USER FOLLOWING`, () => {
    describe('FETCH FOLLOWINGS SUCCESSFULLY', () => {
      let following = new Array(3).fill('-').map((_, index) => {
        return {
          _id: new mongoose.mongo.ObjectId(),
          firstName: `Follower${index}`,
          lastName: `User${index}`,
          email: `followerUser${index}@mail.com`
        }
      })
      before(async () => {
        await Users.insertMany([...following, validUser])
        await Follows.insertMany(
          following.map(following => ({
            followedUserId: following._id,
            followingUserId: validUser._id
          }))
        )
      })
      after(async () => {
        await Users.deleteMany()
        await Follows.deleteMany()
      })
  
      it("should get user's following successfully", done => {
        chai
          .request(app)
          .get(`${baseUrl}${validUser._id}/following`)
          .end((err, res) => {
            res.status.should.equals(200)
            res.body.data.should.have.property('following')
            following.forEach((followed, index) => {
              if (index === 3) return
              let followedUser = res.body.data.following[index].followedUserId
              followedUser.firstName.should.equals(followed.firstName)
              followedUser.lastName.should.equals(followed.lastName)
              followedUser.email.should.equals(followed.email)
            })
            done()
          })
      })
    })
  
    describe('GET FOLLOWING FAILURE', () => {
      it('should return 404 error if user does not exist', done => {
        chai
          .request(app)
          .get(`${baseUrl}${validUser._id}/following`)
          .end((err, res) => {
            res.status.should.equals(404)
            res.body.should.have.property('status').to.equals('error')
            done()
          })
      })
    })
  })
  