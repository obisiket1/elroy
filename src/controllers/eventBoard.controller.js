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
}
