import {Router} from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import RolesController from "../controllers/role.controller.js";

const router = Router();

router.get(
    "/",
    AuthMiddleware.validateToken,
    AuthMiddleware.grantAccess(),
    RolesController.fetchRoles
);

export default router;
