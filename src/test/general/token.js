import chai from 'chai'
import sinon from 'sinon'
import chaiHttp from 'chai-http'
import Sinonchai from 'sinon-chai'

import app from '../../index'

chai.should()
chai.use(Sinonchai)
chai.use(chaiHttp)

export const tokenValidation = (baseUrl, method) => {
  let request

  describe(`${baseUrl}/ TOKEN VALIDATION`, () => {
    beforeEach(() => {
      request = chai.request(app)
      switch (method) {
        case 'get':
          request = request.get(baseUrl)
          break
        case 'post':
          request = request.post(baseUrl)
          break
        case 'patch':
          request = request.patch(baseUrl)
          break
        case 'put':
          request = request.put(baseUrl)
          break
        case 'delete':
          request = request.delete(baseUrl)
          break
      }
    })
    it('Should return 401 error if no token is provided', done => {
      request.send({}).end((err, res) => {
        res.status.should.equals(401)
        res.body.should.have
          .property('error')
          .to.equals('Not authorized to access data')
        done()
      })
    })
    it('Should return 401 error if an invalid token is provided', done => {
      request
        .set('token', 'invalid-jwt-token')
        .send({})
        .end((err, res) => {
          res.status.should.equals(401)
          res.body.should.have
            .property('error')
            .to.equals('Not authorized to access data')
          done()
        })
    })
  })
}
