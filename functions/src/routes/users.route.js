import {Router} from "express";
import UsersController from "../controllers/users.controller.js";
import UserMiddleware from "../middlewares/user.middleware.js";
import UsersValidator from "../validations/user.validator.js";
import ParamsValidator from "../validations/params.validator.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import Helper from "../utils/helpers.utils.js";

const router = Router();


router.get(
    "/attended-events",
    AuthMiddleware.validateToken,
    UsersController.fetchAttendedEvents
);

router.get(
    "/fetch-profile",
    AuthMiddleware.validateToken,
    UsersController.fetchProfile
);

router.get(
    "/:userId",
    ParamsValidator.validateMongooseId("userId"),
    ParamsValidator.mongooseIdValidationResult,
    UserMiddleware.checkUserExistence,
    UsersController.fetchUser
);

router.patch(
    "/update-profile",
    AuthMiddleware.validateToken,
    UserMiddleware.checkUserExistence,
    UsersValidator.validateEditUserData(),
    Helper.validationResult,
    UsersController.updateProfile
);

router.delete(
    "/:userId",
    AuthMiddleware.validateToken,
    // AuthMiddleware.grantAccess(),
    ParamsValidator.validateMongooseId("userId"),
    ParamsValidator.mongooseIdValidationResult,
    UserMiddleware.checkUserExistence,
    UsersController.deleteUser
);

router.post(
    "/:userId/follow",
    AuthMiddleware.validateToken,
    // AuthMiddleware.grantAccess(),
    ParamsValidator.validateMongooseId("userId"),
    ParamsValidator.mongooseIdValidationResult,
    UserMiddleware.checkFollowershipInexistence,
    UsersController.followUser
);

router.get(
    "/:userId/followers",
    ParamsValidator.validateMongooseId("userId"),
    ParamsValidator.mongooseIdValidationResult,
    UserMiddleware.checkUserExistence,
    UsersController.fetchFollowers
);

router.get(
    "/:userId/following",
    ParamsValidator.validateMongooseId("userId"),
    ParamsValidator.mongooseIdValidationResult,
    UserMiddleware.checkUserExistence,
    UsersController.fetchFollowing
);

router.delete(
    "/:userId/unfollow",
    AuthMiddleware.validateToken,
    // AuthMiddleware.grantAccess(),
    ParamsValidator.validateMongooseId("userId"),
    ParamsValidator.mongooseIdValidationResult,
    UserMiddleware.checkFollowershipExistence,
    UsersController.unfollowUser
);

router.post(
    "/add-interests",
    AuthMiddleware.validateToken,
    UsersValidator.validateInterestsData(),
    ParamsValidator.mongooseIdValidationResult,
    UsersController.addInterests
);

export default router;
