import { Router } from 'express'
import AuthController from '../controllers/auth.controller'
import AuthValidator from '../validations/auth.validator'
import AuthMiddleware from '../middlewares/auth.middleware'
import UserMiddleware from '../middlewares/user.middleware'
import UserValidator from '../validations/user.validator'
import UserController from '../controllers/users.controller'

const router = Router()
router.post(
  '/signup',
  AuthValidator.validateSignupData(),
  AuthValidator.signupValidationResult,
  UserMiddleware.checkUserInexistence,
  AuthController.signup
)

router.post(
  '/login',
  AuthValidator.validateLoginData(),
  AuthValidator.loginValidationResult,
  AuthController.login
)

router.patch(
  '/change-password',
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  UserValidator.validateChangePasswordData(),
  UserValidator.changePasswordValidationResult,
  UserMiddleware.checkUserExistence,
  UserMiddleware.checkPasswordsInequality,
  UserController.changePassword
)

router.get('/verify-email', AuthController.verifyEmail)

export default router
