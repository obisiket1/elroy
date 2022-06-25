import {Router} from "express";
import AuthController from "../controllers/auth.controller.js";
import AuthValidator from "../validations/auth.validator.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import UserMiddleware from "../middlewares/user.middleware.js";
import UserValidator from "../validations/user.validator.js";
import UserController from "../controllers/users.controller.js";

const router = Router();
router.post(
    "/signup",
    AuthValidator.validateSignupData(),
    AuthValidator.signupValidationResult,
    UserMiddleware.checkUserInexistence,
    AuthController.signup
);

router.post(
    "/login",
    AuthValidator.validateLoginData(),
    AuthValidator.loginValidationResult,
    AuthController.login
);

router.patch(
    "/change-password",
    AuthMiddleware.validateToken,
    // AuthMiddleware.grantAccess(),
    UserValidator.validateChangePasswordData(),
    UserValidator.changePasswordValidationResult,
    UserMiddleware.checkUserExistence,
    UserController.changePassword
);

router.get(
    "/reload-user",
    AuthMiddleware.validateToken,
    AuthController.reloadUser
);

router.get("/verify-email", AuthController.verifyEmail);

export default router;
