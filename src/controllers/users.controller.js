import Users from '../db/models/users.model'
import UsersUtils from '../utils/user.utils'
import Response from '../utils/response.utils'

export default class UserController {
  /**
   * @memberof UserController
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async changePassword (req, res) {
    try {
      const { password } = req.body

      const encryptpassword = await UsersUtils.encryptPassword(password)

      await Users.findByIdAndUpdate(req.data._id, {
        password: encryptpassword
      })

      Response.Success(res, { message: 'Password changed successfully' })
    } catch (err) {
      return Response.InternalServerError(res, 'Error changing password')
    }
  }
}
