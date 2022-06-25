import {Router} from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import CategoryValidator from "../validations/category.validator.js";
import category from "../middlewares/category.middleware.js";
import CategoriesController from "../controllers/category.controller.js";
import ParamsValidator from "../validations/params.validator.js";
// import {admin} from '../utils/roles.utils.js'

const router = Router();

router.post(
    "/",
    AuthMiddleware.validateToken,
    // AuthMiddleware.grantAccess(admin),
    CategoryValidator.validateCategoryCreationData(),
    CategoryValidator.categoryValidationResult,
    category.checkCategoryInexistence,
    CategoriesController.createCategory
);

router.put(
    "/:categoryId",
    AuthMiddleware.validateToken,
    // AuthMiddleware.grantAccess(admin),
    CategoryValidator.validateCategoryCreationData(),
    CategoryValidator.categoryValidationResult,
    ParamsValidator.validateMongooseId("categoryId"),
    category.checkCategoryInexistence,
    CategoriesController.editCategory
);

router.get(
    "/",
    CategoriesController.fetchCategories
);

router.delete(
    "/:categoryId",
    AuthMiddleware.validateToken,
    // AuthMiddleware.grantAccess(admin),
    CategoriesController.deleteCategory
);

router.delete(
    "/",
    AuthMiddleware.validateToken,
    // AuthMiddleware.grantAccess(admin),
    CategoryValidator.validateCategoryDeletionData(),
    CategoryValidator.categoryValidationResult,
    CategoriesController.deleteCategories
);

export default router;
