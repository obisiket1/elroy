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
}
