import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth.middleware'
import InterestValidator from '../validations/interest.validator'
import Interest from '../middlewares/interest.middleware'
import InterestsController from '../controllers/interest.controller'
import ParamsValidator from '../validations/params.validator'
import {admin} from '../utils/roles.utils'

const router = Router()

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(admin),
  InterestValidator.validateInterestCreationData(),
  InterestValidator.interestValidationResult,
  Interest.checkInterestInexistence,
  InterestsController.createInterest
)

router.put(
  '/:interestId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(admin),
  InterestValidator.validateInterestCreationData(),
  InterestValidator.interestValidationResult,
  ParamsValidator.validateMongooseId('interestId'),
  Interest.checkInterestInexistence,
  InterestsController.editInterest
)

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  InterestsController.fetchInterests
)

router.delete(
  '/:interestId',
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
