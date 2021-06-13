import { chai, app, validUser, Users } from '../general/initializers'

let hashedPassword = (async () => {
  hashedPassword = await userUtils.encryptPassword('12345678')
})()

const baseUrl = '/api/v1/users'

describe('GET USER', () => {
  describe('FETCH USER SUCCESSFULLY', () => {
    before(async () => {
      await Users.create(validUser)
    })
    after(async () => {
      await Users.findByIdAndDelete(validUser._id)
    })

    it('should fetch user successfully', done => {
      chai
        .request(app)
        .get(`${baseUrl}/${validUser._id}`)
        .end((err, res) => {
          res.status.should.equals(200)
          res.body.data.should.have.property('user')
          res.body.data.user.should.have
            .property('firstName')
            .to.equals('John')
          res.body.data.user.should.have
            .property('lastName')
            .to.equals('Doe')
          res.body.data.user.should.have
            .property('email')
            .to.equals('johndoe@mail.com')
          res.body.data.user.should.not.have.property('password')
          done()
        })
    })
  })

  describe('FETCH USER FAILURE', () => {
    it('should return 404 error if user is not found', done => {
      chai
        .request(app)
        .get(`${baseUrl}/${validUser._id}`)
        .end((err, res) => {
          res.status.should.equals(404)
          res.body.should.have.property('status').to.equals('error')
          done()
        })
    })
    it('should return 400 error if user id is invalid mongoose id', done => {
      chai
        .request(app)
        .get(`${baseUrl}/invalid-mongoose-id`)
        .end((err, res) => {
          res.status.should.equals(400)
          res.body.should.have.property('status').to.equals('error')
          done()
        })
    })
  })
})
