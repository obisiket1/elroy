import { Router } from 'express'
import authRouter from './auth.route'
import usersRouter from './users.route'
import notesRouter from './notes.route'

const router = Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/notes', notesRouter)

export default router
