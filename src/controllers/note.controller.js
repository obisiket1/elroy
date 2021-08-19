import Notes from '../db/models/note.model'
import Response from '../utils/response.utils'

export default class NotesController {
  static async createNote (req, res) {
    try {
      const { title, content } = req.body
      const { id: userId } = req.data
      const note = await Notes.create({ title, content, userId })

      Response.Success(res, { note })
    } catch (err) {
      Response.InternalServerError(res, 'Error creating note')
    }
  }

  static async editNote (req, res) {
    try {
      const { title, content } = req.body
      const { noteId } = req.params
      const note = await Notes.findByIdAndUpdate(
        noteId,
        { title, content },
        { returnOriginal: false }
      )

      Response.Success(res, { note })
    } catch (err) {
      Response.InternalServerError(res, 'Error editing note')
    }
  }

  static async fetchNote (req, res) {
    try {
      Response.Success(res, { note: req.dbDoc })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching note')
    }
  }

  static async fetchNotes (req, res) {
    try {
      const { id: userId } = req.data
      const notes = await Notes.find({ userId })

      Response.Success(res, { notes })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching notes')
    }
  }

  static async deleteNote (req, res) {
    try {
      const note = req.dbDoc

      if (!note) {
        return Response.NotFoundError(res, 'This note does not exist')
      }

      await Notes.findByIdAndDelete(note._id)

      Response.Success(res, { message: 'Note deleted successfully' })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting note')
    }
  }

  static async deleteNotes (req, res) {
    try {
      const { noteIds } = req.body
      const { id: userId } = req.data

      const notes = await Notes.deleteMany({ userId, _id: { $in: noteIds } })

      if (!notes) {
        return Response.UnauthorizedError(res, 'Notes could not be deleted')
      }

      Response.Success(res, { message: 'Notes deleted successfully' })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting notes')
    }
  }
}
