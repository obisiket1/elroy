import { Router } from 'express'
import UsersController from '../controllers/users.controller'
import UserMiddleware from '../middlewares/user.middleware'
import ParamsValidator from '../validations/params.validator'
import AuthMiddleware from '../middlewares/auth.middleware'

const router = Router()

router.get(
  '/:userId',
  ParamsValidator.validateMongooseId('userId'),
  ParamsValidator.mongooseIdValidationResult,
  UserMiddleware.checkUserExistence,
  UsersController.fetchUser
)

router.delete(
  '/:userId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  ParamsValidator.validateMongooseId('userId'),
  ParamsValidator.mongooseIdValidationResult,
  UserMiddleware.checkUserExistence,
  UsersController.deleteUser
)

router.post(
  '/follow',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  ParamsValidator.validateMongooseId('followedUser'),
  ParamsValidator.mongooseIdValidationResult,
  UsersController.followUser
)

router.get(
  '/:userId/followers',
  ParamsValidator.validateMongooseId('userId'),
  ParamsValidator.mongooseIdValidationResult,
  UserMiddleware.checkUserExistence,
  UsersController.fetchFollowers
)

router.get(
  '/:userId/following',
  ParamsValidator.validateMongooseId('userId'),
  ParamsValidator.mongooseIdValidationResult,
  UserMiddleware.checkUserExistence,
  UsersController.fetchFollowing
)

export default router
