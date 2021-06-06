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
      const event = await Event.findByIdAndUpdate(req.params.eventId, data, {
        returnOriginal: false
      })

      return Response.Success(res, { event })
    } catch (err) {
      console.log(err)
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

  static async fetchEvent (req, res) {
    try {
      const { eventId } = req.params

      const event = await Event.findById(eventId)

      Response.Success(res, { event })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching event')
    }
  }

  static async deleteEvent (req, res) {
    try {
      const { eventId } = req.params

      const event = await Event.findByIdAndDelete(eventId)

      Response.Success(res, {
        message: `Event "${event.title}" deleted successfully`
      })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting event')
    }
  }

  static async deleteEvents (req, res) {
    try {
      const { eventIds } = req.body
      const { id: creatorId } = req.data

      //Delete events that are provided in the body array whose creatorId is the requesting user
      const returnValue = await Event.deleteMany({
        _id: { $in: eventIds },
        creatorId
      })
      const { deletedCount: count } = returnValue
      const diff = eventIds.length - count

      Response.Success(res, {
        message: `${count} event(s) deleted successfully.${
          diff !== 0
            ? ` ${diff} event(s) could not be deleted likely because you're not the creatorId`
            : ''
        }`
      })
    } catch (err) {
      console.log(err)
      Response.InternalServerError(res, 'Error deleting events')
    }
  }
}
