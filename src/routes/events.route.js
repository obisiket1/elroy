import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth.middleware'
import UsersMiddleware from '../middlewares/user.middleware'
import EventValidator from '../validations/event.validator'
import EventReviewValidator from '../validations/eventReview.validator'
import EventLiveCommentValidator from '../validations/eventLiveComment.validator'
import EventBoardValidator from '../validations/eventBoard.validator'
import EventController from '../controllers/event.controller'
import EventReviewController from '../controllers/eventReview.controller'
import EventLiveCommentController from '../controllers/eventLiveComment.controller'
import EventBoardController from '../controllers/eventBoard.controller'
import Helper from '../utils/helpers.utils'
import Events from '../db/models/event.model'
import EventBoard from '../db/models/eventBoard.model'

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
  Helper.validationResult,
  UsersMiddleware.checkOwnership(Events, 'eventId'),
  EventController.editEvent
)

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventValidator.validateEventsFetchData(),
  Helper.validationResult,
  EventController.fetchEvents
)

router.get(
  '/:eventId',
  // AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventController.fetchEvent
)

router.delete(
  '/:eventId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  UsersMiddleware.checkOwnership(Events, 'eventId'),
  EventController.deleteEvent
)

router.delete(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventController.deleteEvents
)

router.post(
  '/:eventId/reviews',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventReviewValidator.validateEventReviewData(),
  Helper.validationResult,
  EventReviewController.addReview
)

router.get(
  '/:eventId/reviews',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventReviewController.fetchReviews
)

router.post(
  '/:eventId/live-comments',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventLiveCommentValidator.validateEventLiveCommentData(),
  Helper.validationResult,
  EventLiveCommentController.addComment
)

router.post(
  '/:eventId/boards',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventBoardValidator.validateEventBoardData(),
  Helper.validationResult,
  UsersMiddleware.checkOwnership(Events, 'eventId', undefined, 'event'),
  EventBoardController.addBoard
)

router.put(
  '/:eventId/boards/:eventBoardId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventBoardValidator.validateEventBoardData(),
  Helper.validationResult,
  UsersMiddleware.checkOwnership(EventBoard, 'eventBoardId'),
  EventBoardController.editBoard
)

router.get('/:eventId/boards', EventBoardController.fetchBoards)

router.delete(
  '/:eventId/boards/:eventBoardId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  UsersMiddleware.checkOwnership(EventBoard, 'eventBoardId'),
  EventBoardController.deleteBoard
)

router.delete(
  '/:eventId/boards',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  EventBoardValidator.validateEventBoardsDeletionData(),
  Helper.validationResult,
  EventBoardController.deleteBoards
)

export default router
