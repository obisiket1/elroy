import Event from "../db/models/event.model.js";
import User from "../db/models/user.model.js";
import EventAttenders from "../db/models/eventAttender.model.js";
import EventLikers from "../db/models/eventLiker.model.js";
import EventReport from "../db/models/eventReport.model.js";
import Response from "../utils/response.utils.js";
import { encryptPassword } from "../utils/event.utils.js";
import StorageUtils from "../utils/storage.utils.js";
import mongoose from "mongoose";
import EventRegister from "../db/models/eventRegister.model.js";

export default class EventController {
  static async createEvent(req, res, next) {
    try {
      const { id: userId } = req.data;
      const events = await Event.find({
        startDate: { $gte: new Date(req.body.startDate) },
        endDate: { $lte: new Date(req.body.endDate) },
        userId,
      });
      if (events.length) {
        return Response.BadRequestError(
          res,
          "An event occuring within the selected period already exists"
        );
      }
      let data = { ...req.body };
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
        location = req.body.location;
      }
      if (req.body.password) {
        data = {
          ...req.body,
          password: await encryptPassword(req.body.password),
        };
      }
      if (req.body.usePersonalId) {
        const user = await User.findById(userId);
        data = { ...data, eventId: user.personalEventId };
      }
      const event = await Event.create({
        ...data,
        _id,
        displayImage,
        location,
        userId
      });

      return Response.Success(res, { event });
    } catch (err) {
      Response.InternalServerError(res, "Error creating event");
    }
  }

  static async editEvent(req, res) {
    try {
      const { id: userId } = req.data;
      const events = await Event.find({
        startDate: { $gte: new Date(req.body.startDate) },
        endDate: { $lte: new Date(req.body.endDate) },
        userId,
      });
      if (events.length) {
        return Response.BadRequestError(
          res,
          "An event occuring within the selected period already exists"
        );
      }
      let data = { ...req.body };
      const { eventId } = req.params;
      if (req.body.password) {
        data = {
          ...req.body,
          password: await encryptPassword(req.body.password),
        };
      }
      if (req.files && files.displayImage) {
        let file = await StorageUtils.uploadFile(
          req.files.displayImage[0],
          `events/${eventId}/display-image`
        );
        data = { ...data, displayImage: file.Location };
      }
      if (req.body.location) {
        data = { ...data, location: req.body.location };
      }
      if (req.body.usePersonalId) {
        const user = await User.findById(userId);
        data = { ...data, eventId: user.personalEventId };
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
      if (req.files && req.files.displayImage) {
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
      console.log(err);
      Response.InternalServerError(res, "Error editing event");
    }
  }

  // static async getEvents(req, res) {
  //   const {
  //     limit,
  //     offset,
  //     sort,
  //     lat,
  //     lng,
  //     rad,
  //     searchKeyword,
  //     categoryIds,
  //     timeStatus,
  //     ...query
  //   } = req.query;
  //   const { id: userId } = req.data;
  //   let user;

  //   if (id) {
  //     user = await User.findById(id);
  //   }

  //   let params = { ...query };
  //     if (lat && lng) {
  //       params = {
  //         ...params,
  //         location: {
  //           $near: {
  //             $geometry: {
  //               type: "Point",
  //               coordinates: [parseFloat(lng), parseFloat(lat)],
  //             },
  //             $maxDistance: rad ? parseFloat(rad) : 100000,
  //           },
  //         },
  //       };
  //     }
  //     if (timeStatus) {
  //       switch (timeStatus) {
  //         case "past":
  //           params.endDate = { $lt: new Date() };
  //           break;
  //         case "future":
  //           params.startDate = { $gt: new Date() };
  //           break;
  //         case "live":
  //           params.isLive = true;
  //         default:
  //       }
  //     }
  //     if (searchKeyword) {
  //       const search = new RegExp(`.*${searchKeyword}.*`, "i");
  //       params = { ...params, title: search };
  //     }
  //     if (categoryIds) {
  //       params = { ...params, categoryId: { $in: JSON.parse(categoryIds) } };
  //     }


  // }

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
        registered,
        ...query
      } = req.query;
      const { id: userId } = req.data;
      let user;

      if (userId) {
        user = await User.findById(userId);
      }

      if (query.userId) {
        query.userId = new mongoose.mongo.ObjectId(query.userId)
      }

      // console.log(user, query);

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

      console.log(categoryIds);
      if (categoryIds) {
        params = { ...params, categoryId: { $in: categoryIds.map(e => new mongoose.Types.ObjectId(e)) } };
      }
      // const eventst = await Event.find(params)
      //   .sort(sort)
      //   .skip(parseInt(offset))
      //   .limit(parseInt(limit));

      console.log(params);
      const [events] = await Event.aggregate([
        { $match: params },
        { $sort: { createdAt: -1 } },
        ...(userId && timeStatus === "past" ? [
          {
            $lookup: {
              from: EventAttenders.collection.collectionName,
              localField: '_id',
              foreignField: 'eventId',
              as: 'attenders',
              pipeline: [
                {
                  $project: {
                    userId: 1
                  }
                }
              ]
            },
          },
          {
            $match: {
              "attenders.userId": userId
            }
          }
        ]: []),

        ...(user && (registered === "true" ? true: false) ? [
          {
            $lookup: {
              from: EventRegister.collection.collectionName,
              localField: '_id',
              foreignField: 'eventId',
              as: "registered",
            }
          },
          {
            $match: {
              "registered.email": user.email
            }
          },
          {
            $project: {
              "registered": 0
            }
          }
        ]: []),

        {
          $facet: {
            events: [{ $skip: parseInt(offset) || 0 }, { $limit: parseInt(limit) || 20 }],
            totalCount: [
              {
                $count: 'count',
              },
            ],
          },
        },
        { $unwind: '$totalCount' },
        {
          $addFields: {
            count: '$totalCount.count',
          },
        },
        {
          $project: {
            totalCount: 0,
          },
        },
      ])

      const result = events ? { events: events.events, total: events.count } : { events: [], total: 0 }

      Response.Success(res, { ...result });
    } catch (err) {
      console.log(err);
      Response.InternalServerError(res, "Error fetching events");
    }
  }

  static async fetchEvent(req, res) {
    try {
      const { eventId } = req.params;

      const event = await Event.findById(eventId).populate(
        "boards liveComments reviews liveStream"
      );

      Response.Success(res, { event });
    } catch (err) {
      Response.InternalServerError(res, "Error fetching event");
    }
  }

  static async fetchEventByUserKey(req, res) {
    try {
      const { userKey } = req.params;

      const user = await User.findOne(
        { personalEventId: userKey }
      );

      if (!user) {
        return Response.NotFound(res, "events not found");
      }

      const events = await Event.find({ userId: user._id }).populate(
        "boards liveComments reviews liveStream"
      );

      Response.Success(res, { events });
    } catch (err) {
      Response.InternalServerError(res, "Error fetching events");
    }
  }

  static async fetchEventByKey(req, res) {
    try {
      const { eventKey } = req.params;

      const event = await Event.findOne({ key: eventKey }).populate(
        "boards liveComments reviews liveStream"
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

  static async registerForEvent(req, res) {
    try {
      const { eventId } = req.params;
      const { firstName, lastName, email } = req.body;
      const event = await Event.findById(eventId);
  
      // TODO: Handle already existing emails

      if (!event) {
        return Response.NotFoundError(
          res,
          "event with the ID not found"
        );
      }

      const hasRegistered = await EventRegister.find({
        email
      });

      if (hasRegistered) {
        return Response.BadRequestError(
          res,
          "user has already been registered"
        );
      }

      if (new Date(event.startDate) < new Date(Date.now()) ) {
        return Response.BadRequestError(
          res,
          "registration has ended due to event has already happened"
        );
      }

      const attender = await EventRegister.create({
        eventId: event._id,
        firstName,
        lastName,
        email
      });

      return Response.Success(res, { attender });

    } catch (err) {
      Response.InternalServerError(res, "Error reporting event");
    }
  }
}
