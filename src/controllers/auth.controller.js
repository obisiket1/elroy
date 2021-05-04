import Users from '../db/models/user.model'
import Helper from '../utils/user.utils'
import Response from '../utils/response.utils'

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

      const encryptedPassword = await Helper.encryptPassword(password)

      const user = {
        fullName,
        password: encryptedPassword,
        email,
        role
      }

      const result = await Users.create({ ...user })
      result.password = undefined

      const token = Helper.generateToken(user._id, user.role, user.fullName)
      Helper.setCookie(res, token)

      return Response.Success(res, { user: result, token }, 201)
    } catch (err) {
      return Response.InternalServerError(res, 'Error signing up user')
    }
  }

  /**
   * Handles signIn requests
   * @param {ServerRequest} req
   * @param {ServerResponse} res
   * @returns {ServerResponse} response
   */
  static async login (req, res) {
    const signinError = 'Incorrect email or password'
    try {
      const user = await Users.findOne({ email: req.body.email })
      if (!user) return Response.UnauthorizedError(res, signinError)
      const passwordsMatch = await Helper.verifyPassword(
        req.body.password,
        user.password
      )
      if (!passwordsMatch) return Response.UnauthorizedError(res, signinError)
      const token = Helper.generateToken(user._id, user.role, user.firstName)
      Helper.setCookie(res, token)
      user.password = undefined
      const data = { token, user }
      return Response.Success(res, data)
    } catch (err) {
      return Response.InternalServerError(res, 'Error Logging in User')
    }
  }
}
