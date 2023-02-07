/* eslint-disable new-cap */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable max-len */
import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import UsersMiddleware from "../middlewares/user.middleware.js";
import EventValidator from "../validations/event.validator.js";
import EventReviewValidator from "../validations/eventReview.validator.js";
import EventLiveCommentValidator from "../validations/eventLiveComment.validator.js";
import EventBoardValidator from "../validations/eventBoard.validator.js";
import EventController from "../controllers/event.controller.js";
import EventReviewController from "../controllers/eventReview.controller.js";
import EventLiveCommentController from "../controllers/eventLiveComment.controller.js";
import EventLiveStreamController from "../controllers/eventLiveStream.controller.js";
import EventBoardController from "../controllers/eventBoard.controller.js";
import Helper from "../utils/helpers.utils.js";
import Events from "../db/models/event.model.js";
import EventBoard from "../db/models/eventBoard.model.js";
// import multer from "multer";
import multer from "multer-firebase";

const router = Router();

const upload = multer({ dest: "/tmp" });
let Upload;

Upload = upload.fields([{ name: "displayImage", maxCount: 1 }]);

router.post(
  "/",
  Upload,
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventValidator.validateEventCreationData(),
  Helper.validationResult,
  EventController.createEvent
);

router.put(
  "/:eventId",
  Upload,
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventValidator.validateEventEditionData(),
  Helper.validationResult,
  UsersMiddleware.checkOwnership(Events, "eventId"),
  EventController.editEvent
);

router.patch(
  "/:eventId",
  Upload,
  AuthMiddleware.validateToken,
  EventValidator.validateEventUpdateData(),
  Helper.validationResult,
  UsersMiddleware.checkOwnership(Events, "eventId"),
  EventController.updateEventData
);

router.get(
  "/",
  // AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventValidator.validateEventsFetchData(),
  Helper.validationResult,
  EventController.fetchEvents
);

router.get(
  "/:eventId",
  // AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventController.fetchEvent
);

router.delete(
  "/:eventId",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  UsersMiddleware.checkOwnership(Events, "eventId"),
  EventController.deleteEvent
);

router.delete(
  "/",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventController.deleteEvents
);

router.post(
  "/:eventId/reviews",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventReviewValidator.validateEventReviewData(),
  Helper.validationResult,
  EventReviewController.addReview
);

router.get(
  "/:eventId/reviews",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventReviewController.fetchReviews
);

router.post(
  "/:eventId/live-comments",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventLiveCommentValidator.validateEventLiveCommentData(),
  Helper.validationResult,
  EventLiveCommentController.addComment
);

Upload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "audio", maxCount: 1 },
  { name: "document", maxCount: 1 },
]);
router.post(
  "/:eventId/boards",
  Upload,
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventBoardValidator.validateEventBoardData(),
  Helper.validationResult,
  UsersMiddleware.checkOwnership(Events, "eventId", undefined, "event"),
  EventBoardController.addBoard
);

router.put(
  "/:eventId/boards/:eventBoardId",
  Upload,
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventBoardValidator.validateEventBoardData(),
  Helper.validationResult,
  UsersMiddleware.checkOwnership(EventBoard, "eventBoardId"),
  EventBoardController.editBoard
);

router.get("/:eventId/boards/:eventBoardId", EventBoardController.fetchBoard);
router.get("/:eventId/boards", EventBoardController.fetchBoards);

router.delete(
  "/:eventId/boards/:eventBoardId",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  UsersMiddleware.checkOwnership(EventBoard, "eventBoardId"),
  EventBoardController.deleteBoard
);

router.delete(
  "/:eventId/boards",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventBoardValidator.validateEventBoardsDeletionData(),
  Helper.validationResult,
  EventBoardController.deleteBoards
);

router.post(
  "/:eventId/attenders",
  AuthMiddleware.validateToken,
  EventController.addAttender
);

router.get(
  "/:eventId/attenders",
  AuthMiddleware.validateToken,
  UsersMiddleware.checkOwnership(Events, "eventId"),
  EventController.fetchAttenders
);

router.post(
  "/:eventId/register",
  AuthMiddleware.validateToken,
  EventValidator.validateEventRegisterData(),
  Helper.validationResult,
  EventController.registerForEvent
);

router.post(
  "/:eventId/likers",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventController.likeEvent
);

router.post(
  "/:eventId/reports",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventController.reportEvent
);

router.delete(
  "/:eventId/likers",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventController.unlikeEvent
);

router.get(
  "/:eventId/reports",
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventController.fetchEventReports
);

router.post(
  "/:eventId/live-stream",
  AuthMiddleware.validateToken,
  UsersMiddleware.checkOwnership(Events, "eventId"),
  // AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  EventLiveStreamController.addLiveStream
);

export default router;
