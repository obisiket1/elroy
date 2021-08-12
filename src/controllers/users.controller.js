import Users from '../db/models/user.model'
import Events from '../db/models/event.model'
import EventAttenders from '../db/models/eventAttenders.model'
import Follows from '../db/models/follow.model'
import UsersUtils from '../utils/user.utils'
import Response from '../utils/response.utils'

export default class UserController {
  static async fetchUser (req, res) {
    try {
      const { userId } = req.params
      const { full } = req.query

      const user = await Users.findById(userId)
      user.password = undefined

      let data = { user }

      if (full) {
        const eventsCount = await Events.count({ creatorId: userId })
        const followersCount = await Events.count({ followedUserId: userId })
        const followingCount = await Events.count({ followedUserId: userId })

        data = { ...data, eventsCount, followersCount, followingCount }
      }

      Response.Success(res, data)
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching user')
    }
  }
  static async fetchProfile (req, res) {
    try {
      const { id: userId } = req.data
      const { full } = req.query

      const user = await Users.findById(userId)
      user.password = undefined

      let data = { user }

      if (full) {
        const eventsCount = await Events.count({ creatorId: userId })
        const followersCount = await Events.count({ followedUserId: userId })
        const followingCount = await Events.count({ followedUserId: userId })

        data = { ...data, eventsCount, followersCount, followingCount }
      }

      Response.Success(res, data)
    } catch (err) {
      console.log(err)
      return Response.InternalServerError(res, 'Error fetching user')
    }
  }
  static async updateProfile (req, res) {
    try {
      const update = req.body

      const user = await Users.findByIdAndUpdate(req.data.id, update, {
        returnOriginal: false
      })

      Response.Success(res, { user })
    } catch (err) {
      console.log(err)
      return Response.InternalServerError(res, 'Error editing profile')
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
      const { oldPassword, newPassword } = req.body
      const { id } = req.data

      const user = await Users.findById(id)

      const eligible = await UsersUtils.verifyPassword(oldPassword, user.password)
      if (!eligible)
        return Response.UnauthorizedError(
          res,
          "Your provided password doesn't match"
        )

      const encryptpassword = await UsersUtils.encryptPassword(newPassword)

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
      const { id: followingUserId } = req.data
      const { userId: followedUserId } = req.params

      if (followedUserId === followingUserId)
        return Response.BadRequestError(
          res,
          'Users cannot follow their own account'
        )
      const followership = await Follows.create({
        followedUserId,
        followingUserId
      })

      return Response.Success(res, { followership })
    } catch (err) {
      return Response.InternalServerError(res, 'Error following user')
    }
  }

  static async fetchFollowers (req, res) {
    try {
      const { userId: followedUserId } = req.params
      const followers = await Follows.find({ followedUserId }).populate(
        'followingUserId'
      )

      return Response.Success(res, { followers })
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching followers')
    }
  }

  static async fetchFollowing (req, res) {
    try {
      const { userId: followingUserId } = req.params
      const following = await Follows.find({ followingUserId }).populate(
        'followedUserId'
      )

      return Response.Success(res, { following })
    } catch (err) {
      return Response.InternalServerError(res, 'Error fetching following')
    }
  }

  static async unfollowUser (req, res) {
    try {
      const { id: followingUserId } = req.data
      const { userId: followedUserId } = req.params

      await Follows.findOneAndDelete({
        followedUserId,
        followingUserId
      })

      return Response.Success(res, { message: 'User unfollowed successfully' })
    } catch (err) {
      return Response.InternalServerError(res, 'Error unfollowing user')
    }
  }

  static async addInterests (req, res) {
    try {
      const { id } = req.data
      const { interestIds } = req.body
      console.log('id: ', id)

      const user = await Users.findByIdAndUpdate(id, {
        interestIds
      })

      return Response.Success(res, { message: 'Interests added successfully' })
    } catch (err) {
      console.log(err)
      return Response.InternalServerError(res, 'Error adding interests')
    }
  }

  static async fetchAttendedEvents (req, res) {
    try {
      const { id } = req.params || req.data

      const events = await EventAttenders.find({
        userId: id
      }).populate('eventId', 'title description startDate endDate')

      Response.Success(res, { events })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching attended events')
    }
  }
}
