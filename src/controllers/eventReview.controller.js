import EventReviews from '../db/models/eventReview.model'
import Events from '../db/models/event.model'
import Response from '../utils/response.utils'

export default class EventReviewContoller {
  static async addReview (req, res) {
    try {
      const { eventId } = req.params
      const { id: userId } = req.data
      const eventReview = await EventReviews.create({
        ...req.body,
        eventId,
        userId
      })

      return Response.Success(res, { eventReview })
    } catch (err) {
      Response.InternalServerError(res, 'Error adding review to event')
    }
  }
  static async fetchReviews (req, res) {
    try {
      const { eventId } = req.params
      const { sort, limit } = req.query

      const event = await Events.findById(eventId)
      if (event.userId.toHexString() !== req.data.id) {
        return Response.UnauthorizedError(
          res,
          'Only the event owner can access the reviews'
        )
      }

      const eventReviews = await EventReviews.find({ eventId })
        .sort(sort)
        .limit(parseInt(limit))

      Response.Success(res, { eventReviews })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching reviews')
    }
  }
}
