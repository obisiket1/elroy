import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth.middleware'
import CategoryValidator from '../validations/category.validator'
import category from '../middlewares/category.middleware'
import InterestsController from '../controllers/interest.controller'
import ParamsValidator from '../validations/params.validator'
// import {admin} from '../utils/roles.utils'

const router = Router()

router.get(
  '/',
  InterestsController.fetchInterests
)

export default router
