import GeneralServices from '../services/general.services.js'
import Notes from '../db/models/note.model.js'

export default class NoteMiddleware {
  static async checkNoteExistence (req, res, next) {
    GeneralServices.checkDocExistence(
      req,
      res,
      next,
      Notes,
      { _id: req.params.noteId },
      'Note'
    )
  }

  static checkNoteInexistence (req, res, next) {
    GeneralServices.checkDocInexistence(
      res,
      next,
      Notes,
      { name: req.params.noteId },
      'This note'
    )
  }
}
