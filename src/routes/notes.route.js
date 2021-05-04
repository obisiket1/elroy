import { Router } from 'express'
import NoteController from '../controllers/note.controller'
import NoteValidator from '../validations/note.validator'
import AuthMiddleware from '../middlewares/auth.middleware'
import UsersMiddleware from '../middlewares/user.middleware'
import Notes from '../db/models/note.model'

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
  UsersMiddleware.checkOwnership(Notes, 'noteId'),
  NoteController.editNote
)

router.get(
  '/:noteId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  UsersMiddleware.checkOwnership(Notes, 'noteId'),
  NoteController.fetchNote
)

router.get(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  NoteController.fetchNotes
)

router.delete(
  '/:noteId',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  UsersMiddleware.checkOwnership(Notes, 'noteId'),
  NoteController.deleteNote
)

router.delete(
  '/',
  AuthMiddleware.validateToken,
  AuthMiddleware.grantAccess(),
  NoteValidator.validateNotesDeletionData(),
  NoteValidator.noteValidationResult,
  NoteController.deleteNotes
)

export default router
