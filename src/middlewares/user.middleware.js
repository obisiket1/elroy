import Users from '../db/models/user.model'
import Follows from '../db/models/follow.model'
import Response from '../utils/response.utils'
import UserUtils from '../utils/user.utils'
import GeneralServices from '../services/general.services'

/**
 * Contains Users Middlewares
 *
 * @classUsersMiddleware
 */
export default class UsersMiddleware {
  /**
   * @memberof CategoryMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if user doesn't exist
   * @returns {JSON} passes control to the next function if user exists
   */
  static async checkUserExistence (req, res, next) {
    const condition = {
      _id: req.body.userId || req.params.userId || req.data.id
    }
    const user = await Users.findOne(condition)
    if (!user) {
      return Response.NotFoundError(
        res,
        'User with the given id does not exist'
      )
    }
    req.dbUser = user
    return next()
  }

  /**
   * @memberof CategoryMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if user exists
   * @returns {JSON} passes control to the next function if doesn't doesn't exist
   */
  static async checkUserInexistence (req, res, next) {
    const condition = { email: req.body.email }
    const user = await Users.findOne(condition)
    if (user) {
      return Response.ConflictError(
        res,
        'User with the given email already exists'
      )
    }
    return next()
  }

  /**
   * @memberof CategoryMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @returns {JSON} Error response if passwords are equal
   * @returns {JSON} passes control to the next function if passwords are unequal
   */
  static async checkPasswordsInequality (req, res, next) {
    const passwordsEqual = await UserUtils.verifyPassword(
      req.body.password,
      req.dbUser.password
    )
    if (passwordsEqual) {
      return Response.BadRequestError(
        res,
        'Submitted password is the same as current password'
      )
    }
    return next()
  }

  static checkOwnership (Collection, prop, field = 'params', document = '') {
    return async (req, res, next) => {
      try {
        const doc = await Collection.findById(req[field][prop])

        if (doc.creatorId.toHexString() === req.data.id || !doc) {
          req.dbDoc = doc
          return next()
        }
        return Response.UnauthorizedError(
          res,
          `Only the ${
            document ? document + ' ' : ''
          }creator is allowed to perform this action`
        )
      } catch (err) {
        return Response.InternalServerError(res, 'Error checking ownership')
      }
    }
  }

  static checkFollowershipInexistence (req, res, next) {
    GeneralServices.checkDocInexistence(
      res,
      next,
      Follows,
      { followedUserId: req.params.userId, followingUserId: req.data.id },
      'This followership'
    )
  }

  static checkFollowershipExistence (req, res, next) {
    GeneralServices.checkDocExistence(
      req,
      res,
      next,
      Follows,
      { followedUserId: req.params.userId, followingUserId: req.data.id },
      'This followership'
    )
  }
}
