import Event from '../db/models/event.model'
import Response from '../utils/response.utils'
import { encryptPassword } from '../utils/event.utils'
import StorageUtils from '../utils/storage.utils'
import mongoose from 'mongoose'

export default class EventController {
  static async createEvent (req, res, next) {
    try {
      let data = { ...req.body }
      const { id: creatorId } = req.data
      const _id = new mongoose.mongo.ObjectId()
      let displayImage, location
      if (req.files && req.files.displayImage) {
        let file = await StorageUtils.uploadFile(
          req.files.displayImage[0],
          `events/${_id}/display-image`
        )
        displayImage = file.Location
      }
      if (req.body.location) {
        location = JSON.parse(req.body.location)
      }
      if (req.body.password) {
        data = {
          ...req.body,
          password: await encryptPassword(req.body.password)
        }
      }
      const event = await Event.create({
        ...data,
        _id,
        displayImage,
        location,
        creatorId
      })

      return Response.Success(res, { event })
    } catch (err) {
      console.log(err)
      Response.InternalServerError(res, 'Error creating event')
    }
  }

  static async editEvent (req, res) {
    try {
      let data = { ...req.body }
      const { eventId } = req.params
      if (req.body.password) {
        data = {
          ...req.body,
          password: await encryptPassword(req.body.password)
        }
      }
      if (req.files.displayImage) {
        let file = await StorageUtils.uploadFile(
          req.files.displayImage[0],
          `events/${eventId}/display-image`
        )
        data = { ...data, displayImage: file.Location }
      }
      if (req.body.location) {
        data = { ...data, location: JSON.parse(req.body.location) }
      }

      const event = await Event.findByIdAndUpdate(req.params.eventId, data, {
        returnOriginal: false
      })

      return Response.Success(res, { event })
    } catch (err) {
      Response.InternalServerError(res, 'Error editing event')
    }
  }

  static async fetchEvents (req, res) {
    try {
      const {
        limit,
        offset,
        sort,
        lat,
        lng,
        rad,
        searchKeyword,
        categoryIds,
        ...query
      } = req.query

      let params = { ...query }
      if (lat && lng) {
        params = {
          ...params,
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: rad ? parseFloat(rad) : 100000
            }
          }
        }
      }
      if (searchKeyword) {
        const search = new RegExp(`.*${searchKeyword}.*`, 'i')
        params = { ...params, title: search }
      }
      if (categoryIds) {
        params = { ...params, categoryId: { $in: JSON.parse(categoryIds) } }
      }
      const events = await Event.find(params)
        .sort(sort)
        .skip(parseInt(offset))
        .limit(parseInt(limit))

      Response.Success(res, { events })
    } catch (err) {
      console.log(err)
      Response.InternalServerError(res, 'Error fetching events')
    }
  }

  static async fetchEvent (req, res) {
    try {
      const { eventId } = req.params

      const event = await Event.findById(eventId).populate(
        'boards liveComments reviews'
      )

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
            ? ` ${diff} event(s) could not be deleted likely because you're not the creator`
            : ''
        }`
      })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting events')
    }
  }
}
