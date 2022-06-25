import {Router} from "express";
import AnalyticsController from "../controllers/analytics.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = Router();


router.get(
    "/",
    AuthMiddleware.validateToken,
    // AuthMiddleware.grantAccess(),
    AnalyticsController.fetchAnalytics
);

export default router;
