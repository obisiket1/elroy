import EventLiveComment from '../db/models/eventLiveComment.model'
import Response from '../utils/response.utils'

export default class EventLiveCommentController {
  static async addComment (req, res) {
    try {
      const { eventId } = req.params
      const { id: creatorId } = req.data

      const eventLiveComment = await EventLiveComment.create({
        ...req.body,
        eventId,
        creatorId
      })

      return Response.Success(res, { eventLiveComment })
    } catch (err) {
      Response.InternalServerError(res, 'Error adding comment')
    }
  }
}
