import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import AuthValidator from '../validations/auth.validator';
import AuthMiddleware from '../middlewares/auth.middleware';
import UserMiddleware from '../middlewares/user.middleware';

const router = Router();
router.post(
  '/signup',
//   AuthMiddleware.validateToken,
//   AuthMiddleware.grantAccess(),
  AuthValidator.validateSignupData(),
  AuthValidator.signupValidationResult,
  UserMiddleware.checkUserInexistence,
  AuthController.signup,
);

router.post(
  '/login',
  AuthValidator.validateLoginData(),
  AuthValidator.loginValidationResult,
  AuthController.login,
);

export default router