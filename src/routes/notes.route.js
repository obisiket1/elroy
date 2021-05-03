import { Router } from 'express'
import NoteController from '../controllers/note.controller'
import NoteValidator from '../validations/note.validator'
import AuthMiddleware from '../middlewares/auth.middleware'

const router = Router()

router.post(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  NoteValidator.validateNoteData(),
  NoteValidator.noteValidationResult,
  NoteController.createNote
)

router.put(
  '/:noteId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  NoteValidator.validateNoteData(),
  NoteValidator.noteValidationResult,
  NoteController.editNote
)

export default router
