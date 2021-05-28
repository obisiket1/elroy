import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth.middleware'
import CategoryValidator from '../validations/category.validator'
import category from '../middlewares/category.middleware'
import CategoriesController from '../controllers/category.controller'
import ParamsValidator from '../validations/params.validator'
import {admin} from '../utils/roles.utils'

const router = Router()

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(admin),
  CategoryValidator.validateCategoryCreationData(),
  CategoryValidator.categoryValidationResult,
  category.checkCategoryInexistence,
  CategoriesController.createCategory
)

router.put(
  '/:categoryId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(admin),
  CategoryValidator.validateCategoryCreationData(),
  CategoryValidator.categoryValidationResult,
  ParamsValidator.validateMongooseId('categoryId'),
  category.checkCategoryInexistence,
  CategoriesController.editCategory
)

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  CategoriesController.fetchCategories
)

router.delete(
  '/:categoryId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(admin),
  CategoriesController.deleteCategory
)

router.delete(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(admin),
  CategoryValidator.validateCategoryDeletionData(),
  CategoryValidator.categoryValidationResult,
  CategoriesController.deleteCategories
)

export default router
