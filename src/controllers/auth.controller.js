import User from '../db/models/users.model'
import Helper from '../utils/user.utils'
import Response from '../utils/response.utils'
import jwt from 'jsonwebtoken'

/**
 * Contains AuthController
 *
 * @class AuthController
 */
export default class AuthController {
  /**
   *
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async signup (req, res) {
    try {
      const { fullName, password, email, role } = req.body

      const encryptpassword = await Helper.encryptPassword(password)

      const user = {
        fullName,
        password: encryptpassword,
        email,
        role
      }

      const result = await User.create({ ...user })

      const token = Helper.generateToken(user._id, user.role, user.fullName);
      Helper.setCookie(res, token);

      return Response.Success(res, { user: result }, 201)
    return Response.Success(res, {message: 'Signup successful'})
    } catch (err) {
      return Response.InternalServerError(res, 'Error signing up user')
    }
  }
}
