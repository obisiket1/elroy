import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth.middleware'
import InterestValidator from '../validations/category.validator'
import category from '../middlewares/category.middleware'
import InterestsController from '../controllers/category.controller'
import ParamsValidator from '../validations/params.validator'
import {admin} from '../utils/roles.utils'

const router = Router()

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(admin),
  InterestValidator.validateInterestCreationData(),
  InterestValidator.interestValidationResult,
  category.checkInterestInexistence,
  InterestsController.createInterest
)

router.put(
  '/:categoryId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(admin),
  InterestValidator.validateInterestCreationData(),
  InterestValidator.interestValidationResult,
  ParamsValidator.validateMongooseId('categoryId'),
  category.checkInterestInexistence,
  InterestsController.editInterest
)

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  InterestsController.fetchInterests
)

router.delete(
  '/:categoryId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(admin),
  InterestsController.deleteInterest
)

router.delete(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(admin),
  InterestValidator.validateInterestDeletionData(),
  InterestValidator.interestValidationResult,
  InterestsController.deleteInterests
)

export default router
