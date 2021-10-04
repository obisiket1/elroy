import { Router } from 'express'
import AnalyticsController from '../controllers/analytics.controller'
import AuthMiddleware from '../middlewares/auth.middleware'

const router = Router()


router.get(
  '/',
  AuthMiddleware.validateToken,
  // AuthMiddleware.grantAccess(),
  AnalyticsController.fetchAnalytics
)

export default router
