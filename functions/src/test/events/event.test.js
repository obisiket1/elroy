import chai from 'chai'
import sinon from 'sinon'
import chaiHttp from 'chai-http'
import Sinonchai from 'sinon-chai'
import Users from '../../db/models/user.model.js'
import Category from '../../db/models/category.model.js'
import userUtils from '../../utils/user.utils.js'
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import app from '../../index.js'

const unhashedPassword = '12345678'
const user = {
  _id: new mongoose.mongo.ObjectId(),
  firstName: 'JohnXX',
  lastName: 'DoeCC',
  email: 'johndoe2CC@mail.com',
  password: unhashedPassword
}
let hashedPassword;

(async () => {
  hashedPassword = await userUtils.encryptPassword(unhashedPassword)
})()

const baseUrl = '/api/v1/'

const barrel = {};

let categoryIds = [];

before(async () => {
  const xuser = await Users.create({
    ...user,
    password: hashedPassword
  });

  await Category.create({
    userId: xuser._id,
    name: faker.animal.fish(),
  });

  categoryIds = (await Category.find()).map((e) => e._id.toString());

  const loginRequest = async () => new Promise((resolve, reject) => {
    chai
    .request(app)
    .post(`${baseUrl}/auth/login`)
    .send(user)
    .end((err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(res.body)
    })
  });

  const result = await loginRequest();
  barrel.userToken = result.data.token;
});

describe('EVENTS', () => {
  describe('CREATE EVENT', () => {
    it('should create a new event', done => {
      chai
        .request(app)
        .post(`${baseUrl}/events`)
        .set("x-access-token", barrel.userToken)
        .send({
          title: faker.random.word(),
          description: faker.random.words(),
          categoryId: categoryIds[faker.mersenne.rand(categoryIds.length, 0)],
          "startDate": "2023-12-25",
          "endDate": "2023-12-30",
        })
        .end((err, res) => {
          if (res.error) console.log(">>", res.error)
          else console.log(res.body)          
          res.should.have.status(200)
          res.body.data.should.have.property('event')
          res.body.data.event.should.have.property('_id')
          barrel.eventId = res.body.data.event._id,
          done()
        })
    })

  })

  describe('CREATE EVENT STREAM', () => {
    it('should create a new event stream', done => {
      chai
        .request(app)
        .post(`${baseUrl}/events/${barrel.eventId}/live-stream`)
        .set("x-access-token", barrel.userToken)
        .send({
          title: faker.random.word(),
        })
        .end((err, res) => {
          if (res.error) console.log(">>", res.error)
          else console.log(res.body);

          res.should.have.status(200)
          res.body.data.should.have.property('eventLiveStream')
          done()
        })
    })
  })

  describe('GET EVENT DATA', () => {
    it('should return the event data', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/events/${barrel.eventId}`)
        .set("x-access-token", barrel.userToken)
        .end((err, res) => {
          if (res.error) console.log(">>", res.error)
          else console.log(res.body);

          res.should.have.status(200)
          // res.body.data.should.have.property('eventLiveStream')
          done()
        })
    })
  })
})