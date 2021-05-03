import { Router } from 'express'
import UsersController from '../controllers/users.controller'
import UserMiddleware from '../middlewares/user.middleware'
import ParamsValidator from '../validations/params.validator';
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

export default router
