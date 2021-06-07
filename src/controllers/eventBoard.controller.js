import EventBoard from '../db/models/eventBoard.model'
import Response from '../utils/response.utils'

export default class EventBoardController {
  static async addBoard (req, res) {
    try {
      const { type, name } = req.body
      const { eventId } = req.params
      const { id: creatorId } = req.data

      const eventBoard = await EventBoard.create({
        type,
        name,
        eventId,
        creatorId
      })
      Response.Success(res, { eventBoard })
    } catch (err) {
      Response.InternalServerError(res, 'Error adding event board')
    }
  }

  static async editBoard (req, res) {
    try {
      const { type, name } = req.body
      const { eventBoardId } = req.params

      const eventBoard = await EventBoard.findByIdAndUpdate(
        eventBoardId,
        {
          type,
          name
        },
        { returnOriginal: false }
      )
      Response.Success(res, { eventBoard })
    } catch (err) {
      Response.InternalServerError(res, 'Error editing event board')
    }
  }

  static async fetchBoards (req, res) {
    try {
      const { eventId } = req.params

      const eventBoards = await EventBoard.find({ eventId })

      Response.Success(res, { eventBoards })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching event boards')
    }
  }

  static async deleteBoard (req, res) {
    try {
      const { eventBoardId } = req.params

      const deletedEventBoard = await EventBoard.findByIdAndDelete(eventBoardId)

      Response.Success(res, { deletedEventBoard })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting event board')
    }
  }

  static async deleteBoards (req, res) {
    try {
      const { eventBoardIds } = req.body
      const { eventId } = req.params
      const { id: creatorId } = req.data

      const deletedEventBoards = await EventBoard.deleteMany({
        creatorId,
        _id: { $in: eventBoardIds }
      })
      const { deletedCount: count } = deletedEventBoards
      const diff = eventBoardIds.length - count

      Response.Success(res, {
        message: `${count} event board(s) deleted successfully.${
          diff !== 0
            ? ` ${diff} event board(s) could not be deleted likely because you're not the creator`
            : ''
        }`
      })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting event boards')
    }
  }
}
