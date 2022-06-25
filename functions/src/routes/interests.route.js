import {Router} from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import CategoryValidator from "../validations/category.validator.js";
import category from "../middlewares/category.middleware.js";
import InterestsController from "../controllers/interest.controller.js";
import ParamsValidator from "../validations/params.validator.js";
// import {admin} from '../utils/roles.utils.js'

const router = Router();

router.get(
    "/",
    InterestsController.fetchInterests
);

export default router;
