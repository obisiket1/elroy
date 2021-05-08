import { Router } from 'express'
import authRouter from './auth.route'
import usersRouter from './users.route'
import notesRouter from './notes.route'
import interestRouter from './interest.route'
import roleRouter from './role.route'

const router = Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/notes', notesRouter)
router.use('/interests', interestRouter)
router.use('/roles', roleRouter)

export default router
