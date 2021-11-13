import Event from "../db/models/event.model";
import EventAttenders from "../db/models/eventAttender.model";
import EventLikers from "../db/models/eventLiker.model";
import EventReport from "../db/models/eventReport.model";
import Response from "../utils/response.utils";
import { encryptPassword } from "../utils/event.utils";
import StorageUtils from "../utils/storage.utils";
import mongoose from "mongoose";

export default class EventController {
  static async createEvent(req, res, next) {
    try {
      let data = { ...req.body };
      const { id: userId } = req.data;
      const _id = new mongoose.mongo.ObjectId();
      let displayImage, location;
      if (req.files && req.files.displayImage) {
        let file = await StorageUtils.uploadFile(
          req.files.displayImage[0],
          `events/${_id}/display-image`
        );
        displayImage = file.Location;
      }
      if (req.body.location) {
        location = JSON.parse(req.body.location);
      }
      if (req.body.password) {
        data = {
          ...req.body,
          password: await encryptPassword(req.body.password),
        };
      }
      const event = await Event.create({
        ...data,
        _id,
        displayImage,
        location,
        userId,
      });

      return Response.Success(res, { event });
    } catch (err) {
      console.log(err);
      Response.InternalServerError(res, "Error creating event");
    }
  }

  static async editEvent(req, res) {
    try {
      let data = { ...req.body };
      const { eventId } = req.params;
      if (req.body.password) {
        data = {
          ...req.body,
          password: await encryptPassword(req.body.password),
        };
      }
      if (req.files.displayImage) {
        let file = await StorageUtils.uploadFile(
          req.files.displayImage[0],
          `events/${eventId}/display-image`
        );
        data = { ...data, displayImage: file.Location };
      }
      if (req.body.location) {
        data = { ...data, location: JSON.parse(req.body.location) };
      }

      const event = await Event.findByIdAndUpdate(req.params.eventId, data, {
        returnOriginal: false,
      });

      return Response.Success(res, { event });
    } catch (err) {
      Response.InternalServerError(res, "Error editing event");
    }
  }

  static async updateEventData(req, res) {
    try {
      let data = { ...req.body };
      const { eventId } = req.params;
      if (req.body.password) {
        data = {
          ...req.body,
          password: await encryptPassword(req.body.password),
        };
      }
      if (req.files.displayImage) {
        let file = await StorageUtils.uploadFile(
          req.files.displayImage[0],
          `events/${eventId}/display-image`
        );
        data = { ...data, displayImage: file.Location };
      }
      if (req.body.location) {
        data = { ...data, location: JSON.parse(req.body.location) };
      }

      const event = await Event.findByIdAndUpdate(req.params.eventId, data, {
        returnOriginal: false,
      });

      return Response.Success(res, { event });
    } catch (err) {
      Response.InternalServerError(res, "Error editing event");
    }
  }

  static async fetchEvents(req, res) {
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
        timeStatus,
        ...query
      } = req.query;

      let params = { ...query };
      if (lat && lng) {
        params = {
          ...params,
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [parseFloat(lng), parseFloat(lat)],
              },
              $maxDistance: rad ? parseFloat(rad) : 100000,
            },
          },
        };
      }
      if (timeStatus) {
        switch (timeStatus) {
          case "past":
            params.endDate = { $lt: new Date() };
            break;
          case "future":
            params.startDate = { $gt: new Date() };
            break;
          case "live":
            params.isLive = true;
          default:
        }
      }
      if (searchKeyword) {
        const search = new RegExp(`.*${searchKeyword}.*`, "i");
        params = { ...params, title: search };
      }
      if (categoryIds) {
        params = { ...params, categoryId: { $in: JSON.parse(categoryIds) } };
      }
      const events = await Event.find(params)
        .sort(sort)
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      Response.Success(res, { events });
    } catch (err) {
      console.log(err);
      Response.InternalServerError(res, "Error fetching events");
    }
  }

  static async fetchEvent(req, res) {
    try {
      const { eventId } = req.params;

      const event = await Event.findById(eventId).populate(
        "boards liveComments reviews"
      );

      Response.Success(res, { event });
    } catch (err) {
      Response.InternalServerError(res, "Error fetching event");
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;

      const event = await Event.findByIdAndDelete(eventId);

      Response.Success(res, {
        message: `Event "${event.title}" deleted successfully`,
      });
    } catch (err) {
      Response.InternalServerError(res, "Error deleting event");
    }
  }

  static async deleteEvents(req, res) {
    try {
      const { eventIds } = req.body;
      const { id: userId } = req.data;

      //Delete events that are provided in the body array whose userId is the requesting user
      const returnValue = await Event.deleteMany({
        _id: { $in: eventIds },
        userId,
      });
      const { deletedCount: count } = returnValue;
      const diff = eventIds.length - count;

      Response.Success(res, {
        message: `${count} event(s) deleted successfully.${
          diff !== 0
            ? ` ${diff} event(s) could not be deleted likely because you're not the creator`
            : ""
        }`,
      });
    } catch (err) {
      Response.InternalServerError(res, "Error deleting events");
    }
  }

  static async addAttender(req, res) {
    try {
      const { id: userId } = req.data;
      const { eventId } = req.params;

      await EventAttenders.create({ userId, eventId });
      Response.Success(res, {
        message: `Event attender added successfully`,
      });
    } catch (err) {
      Response.InternalServerError(res, "Error adding attender");
    }
  }

  static async fetchAttenders(req, res) {
    try {
      const { eventId } = req.params;

      const events = await EventAttenders.find({ eventId });

      Response.Success(res, { events });
    } catch (err) {
      Response.InternalServerError(res, "Error adding attender");
    }
  }

  static async likeEvent(req, res) {
    try {
      const { id } = req.data;
      const { eventId } = req.params;

      const exists = await EventLikers.findOne({ userId: id, eventId });
      if (exists) {
        return Response.UnauthorizedError(
          res,
          "You have already liked this event"
        );
      }
      await EventLikers.create({ userId: id, eventId });
      await Event.findByIdAndUpdate(eventId, { $inc: { likesCount: 1 } });

      Response.Success(res, { message: "Event liked successfully" });
    } catch (err) {
      Response.InternalServerError(res, "Error liking event");
    }
  }

  static async unlikeEvent(req, res) {
    try {
      const { id } = req.data;
      const { eventId } = req.params;

      const like = await EventLikers.findOneAndDelete({
        userId: id,
        eventId,
      });
      if (like) {
        await Event.findByIdAndUpdate(eventId, { $inc: { likesCount: -1 } });
      }

      Response.Success(res, { message: "Event unliked successfully" });
    } catch (err) {
      Response.InternalServerError(res, "Error unliking event");
    }
  }

  static async reportEvent(req, res) {
    try {
      const { id: userId } = req.data;
      const { eventId } = req.params;
      const { reason } = req.body;

      const eventReport = await EventReport.create({ userId, eventId, reason });

      Response.Success(res, { eventReport });
    } catch (err) {
      Response.InternalServerError(res, "Error reporting event");
    }
  }

  static async fetchEventReports(req, res) {
    try {
      const { eventId } = req.params;

      const eventReports = await EventReport.find({ eventId });

      Response.Success(res, { eventReports });
    } catch (err) {
      Response.InternalServerError(res, "Error reporting event");
    }
  }
}
