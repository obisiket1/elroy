import Users from '../db/models/user.model'
import Helper from '../utils/user.utils'
import Response from '../utils/response.utils'
import AuthServices from '../services/auth.services'

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
      const { firstName, lastName, password, email, role } = req.body

      const encryptedPassword = await Helper.encryptPassword(password)

      const user = {
        firstName,
        lastName,
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

  static async facebookLogin (req, res) {
    try {
      const { token } = req.body
      const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
          fields: ['id', 'email', 'first_name', 'last_name'].join(','),
          access_token: token
        }
      })
      if (data) {
        const response = {
          email: data.email,
          fullName: `${data.first_name} ${data.last_name}`,
          isActivated: true,
          facebookUserId: data.id
        }

        let myUser = await AuthServices.checkEmailExistence(data.email, res)

        // if the user does not have an account
        if (!myUser) {
          myUser = await Auth.create({ ...response })
        }

        const userToken = await Helper.generateToken(
          myUser._id,
          myUser.role,
          myUser.fullName
        )

        return Response.Success(res, { user: myUser, token: userToken }, 201)
      }
      return res.status(200).json({
        status: 'success',
        data
      })
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error logging in user through facebook'
      })
    }
  }
}
