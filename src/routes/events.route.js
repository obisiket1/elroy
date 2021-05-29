import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth.middleware'
import UsersMiddleware from '../middlewares/user.middleware'
import EventValidator from '../validations/event.validator'
import EventController from '../controllers/event.controller'
import Helper from '../utils/helpers.utils'
import Events from '../db/models/event.model'

const router = Router()

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventValidator.validateEventCreationData(),
  Helper.validationResult,
  EventController.createEvent
)

router.put(
  '/:eventId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventValidator.validateEventEditionData(),
  UsersMiddleware.checkOwnership(Events, 'eventId'),
  Helper.validationResult,
  EventController.editEvent
)

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventController.fetchEvents
)

export default router
