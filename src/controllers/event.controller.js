import Event from '../db/models/event.model'
import Response from '../utils/response.utils'

export default class EventController {
  static async createEvent (req, res, next) {
    try {
      const event = await Event.create(req.body)

      return Response.Success(res, { event })
    } catch (err) {
      Response.InternalServerError(res, 'Error creating event')
    }
  }
}
