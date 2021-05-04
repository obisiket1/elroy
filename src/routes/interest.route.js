import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth.middleware'
import InterestValidator from '../validations/interest.validator'
import Interest from '../middlewares/interest.middleware'
import InterestsController from '../controllers/interest.controller'
import ParamsValidator from '../validations/params.validator'
import UsersMiddleware from '../middlewares/user.middleware'
import Interests from '../db/models/interest.model'

const router = Router()

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  InterestValidator.validateInterestCreationData(),
  InterestValidator.interestValidationResult,
  Interest.checkInterestInexistence,
  InterestsController.createInterest
)

router.put(
  '/:interestId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  InterestValidator.validateInterestCreationData(),
  InterestValidator.interestValidationResult,
  ParamsValidator.validateMongooseId('interestId'),
  UsersMiddleware.checkOwnership(Interests, 'interestId'),
  Interest.checkInterestInexistence,
  InterestsController.editInterest
)

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  InterestsController.fetchInterests
)

export default router
