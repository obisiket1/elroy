import Event from '../db/models/event.model'
import Response from '../utils/response.utils'
import { encryptPassword } from '../utils/event.utils'

export default class EventController {
  static async createEvent (req, res, next) {
    try {
      let data = { ...req.body }
      if (req.body.password) {
        data = {
          ...req.body,
          password: await encryptPassword(req.body.password)
        }
      }
      const event = await Event.create(data)

      return Response.Success(res, { event })
    } catch (err) {
      Response.InternalServerError(res, 'Error creating event')
    }
  }

  static async editEvent (req, res) {
    try {
      let data = { ...req.body }
      if (req.body.password) {
        data = {
          ...req.body,
          password: await encryptPassword(req.body.password)
        }
      }
      const event = await Event.findByIdAndUpdate(req.body._id, data, {
        returnOriginal: false
      })

      return Response.Success(res, { event })
    } catch (err) {
      Response.InternalServerError(res, 'Error editing event')
    }
  }

  static async fetchEvents (req, res) {
    try {
      const { limit, sort, ...query } = req.query

      const events = await Event.find(query)
        .sort(sort)
        .limit(parseInt(limit))

      Response.Success(res, { events })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching events')
    }
  }
}
