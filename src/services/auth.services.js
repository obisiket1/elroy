import Users from '../db/models/user.model'
import Response from '../utils/response.utils'

export default class AuthServices {
  static async checkEmailExistence (email, res) {
    try {
      return await Users.findOne({ email })
    } catch (err) {
      return Response.InternalServerError(res, 'Error checking email address')
    }
  }
}
