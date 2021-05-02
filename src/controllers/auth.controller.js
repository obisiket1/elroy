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
    //   const { firstName, lastName, password, email, role } = req.body

    //   const encryptpassword = await Helper.encryptPassword(password)

    //   const newUser = {
    //     firstName,
    //     lastName,
    //     password: encryptpassword,
    //     email,
    //     role
    //   }

    //   const result = await User.create({ ...newUser })

    //   return Response.Success(res, { user: result }, 201)
    return Response.Success(res, {message: 'Signup successful'})
    } catch (err) {
      return Response.InternalServerError(res, 'Error signing up user')
    }
  }
}
