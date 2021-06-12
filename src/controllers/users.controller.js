import Users from '../db/models/user.model'
import Follows from '../db/models/follow.model'
import UsersUtils from '../utils/user.utils'
import Response from '../utils/response.utils'

export default class UserController {
  static async fetchUser (req, res) {
    try {
      const { userId } = req.params

      const user = await Users.findById(userId)
      user.password = undefined

      Response.Success(res, { user })
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching user')
    }
  }
  static async deleteUser (req, res) {
    try {
      const { userId } = req.params

      await Users.findByIdAndDelete(userId)

      Response.Success(res, { message: `User deleted successfully` })
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching user')
    }
  }
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

      await Users.findByIdAndUpdate(req.data.id, {
        password: encryptpassword
      })

      Response.Success(res, { message: 'Password changed successfully' })
    } catch (err) {
      return Response.InternalServerError(res, 'Error changing password')
    }
  }

  static async followUser (req, res) {
    try {
      const { id: followingUser } = req.data
      const { userId: followedUser } = req.params

      if (followedUser === followingUser)
        return Response.BadRequestError(
          res,
          'Users cannot follow their own account'
        )
      await Follows.create({
        followedUser,
        followingUser
      })

      return Response.Success(res, { message: 'User followed successfully' })
    } catch (err) {
      return Response.InternalServerError(res, 'Error following user')
    }
  }

  static async fetchFollowers (req, res) {
    try {
      const { userId: followedUser } = req.params
      const followers = await Follows.find({ followedUser }).populate(
        'followingUser',
        'fullName'
      )

      return Response.Success(res, { followers })
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching followers')
    }
  }

  static async fetchFollowing (req, res) {
    try {
      const { userId: followingUser } = req.params
      const following = await Follows.find({ followingUser }).populate(
        'followedUser',
        'fullName'
      )

      return Response.Success(res, { following })
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching following')
    }
  }

  static async unfollowUser (req, res) {
    try {
      const { id: followingUser } = req.data
      const { userId: followedUser } = req.params

      await Follows.findOneAndDelete({
        followedUser,
        followingUser
      })

      return Response.Success(res, { message: 'User unfollowed successfully' })
    } catch (err) {
      return Response.InternalServerError(res, 'Error unfollowing user')
    }
  }
}
