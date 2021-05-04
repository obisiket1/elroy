import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth.middleware'
import InterestValidator from '../validations/interest.validator'
import Interest from '../middlewares/interest.middleware'
import InterestsController from '../controllers/interest.controller'

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

export default router
