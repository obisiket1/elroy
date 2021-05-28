import Event from '../db/models/event.model'
import Response from '../utils/response.utils'
import { encryptPassword } from '../utils/event.utils'

export default class EventController {
  static async createEvent (req, res, next) {
    try {
      let data = { ...req.body }
      if (req.body.password) {
        data = { ...req.body, password: await encryptPassword(req.body.password) }
      }
      const event = await Event.create(data)

      return Response.Success(res, { event })
    } catch (err) {
      console.log(err)
      Response.InternalServerError(res, 'Error creating event')
    }
  }
}
