import { Router } from 'express'
import authRouter from './auth.route'
import usersRouter from './users.route'
import notesRouter from './notes.route'
import interestRouter from './category.route'
import roleRouter from './role.route'
import eventRouter from './events.route'

const router = Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/notes', notesRouter)
router.use('/categories', interestRouter)
router.use('/roles', roleRouter)
router.use('/events', eventRouter)

export default router
