import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth.middleware'
import RolesController from '../controllers/role.controller'

const router = Router()

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  RolesController.fetchRoles
)

export default router
