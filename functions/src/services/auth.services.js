import Users from '../db/models/user.model.js'
import Response from '../utils/response.utils.js'

export default class AuthServices {
  static async checkEmailExistence (email, res) {
    try {
      return await Users.findOne({ email })
    } catch (err) {
      return Response.InternalServerError(res, 'Error checking email address')
    }
  }
}
