import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth.middleware'
import UsersMiddleware from '../middlewares/user.middleware'
import EventValidator from '../validations/event.validator'
import EventController from '../controllers/event.controller'
import Helper from '../utils/helpers.utils'

const router = Router()

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventValidator.validateEventCreationData(),
  Helper.validationResult,
  EventController.createEvent
)

export default router
