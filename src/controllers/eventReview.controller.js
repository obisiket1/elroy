import EventReviews from '../db/models/eventReview.model'
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
}
