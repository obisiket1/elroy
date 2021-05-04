import Notes from '../db/models/note.model'
import Response from '../utils/response.utils'

export default class NotesController {
  static async createNote (req, res) {
    try {
      const { title, content } = req.body
      const { id: creatorId } = req.data
      const note = await Notes.create({ title, content, creatorId })

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
      const { noteId } = req.params
      const { id } = req.data
      const note = await Notes.findById(noteId)
      if (id !== note.creatorId.toHexString())
        return Response.UnauthorizedError(
          res,
          'You are not authorized to access this note'
        )

      Response.Success(res, { note })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching note')
    }
  }

  static async fetchNotes (req, res) {
    try {
      const { id: creatorId } = req.data
      const notes = await Notes.find({ creatorId })

      Response.Success(res, { notes })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching notes')
    }
  }

  static async deleteNote (req, res) {
    try {
      const { noteId: _id } = req.params
      const { id: creatorId } = req.data

      const note = await Notes.findById(_id)

      if (!note) {
        return Response.NotFoundError(res, 'This note does not exist')
      }

      if (note.creatorId !== creatorId) {
        return Response.UnauthorizedError(
          res,
          'You are not authorized to delete this note'
        )
      }

      await Notes.findByIdAndDelete(note._id)

      Response.Success(res, { message: 'Note deleted successfully' })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching notes')
    }
  }
}
