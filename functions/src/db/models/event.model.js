import mongoose from "mongoose";
import geoSchema from "../schemas/geoLocation.schema.js";
import {v4 as uuid} from "uuid";

const dateSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
});
const eventSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
      description: String,
      categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: "category",
      },
      startDate: Date,
      endDate: Date,
      dates: [dateSchema],
      attendanceLimit: Number,
      requirePassword: Boolean,
      password: String,
      requireAuthentication: Boolean,
      backgroundImage: String,
      location: geoSchema,
      displayImage: String,
      isLive: {type: Boolean, default: false},
      likesCount: {type: Number, default: 0},
      viewsCount: {type: Number, default: 0},
      reviewsCount: {type: Number, default: 0},
      eventId: {type: String, default: uuid()},
    },
    {
      timestamps: true,
      toJSON: {virtuals: true},
      toObject: {virtuals: true},
    }
);

eventSchema.virtual("boards", {
  ref: "eventBoard",
  localField: "_id",
  foreignField: "eventId",
  justOne: false,
});
eventSchema.virtual("reviews", {
  ref: "eventReview",
  localField: "_id",
  foreignField: "eventId",
  justOne: false,
});
eventSchema.virtual("liveComments", {
  ref: "eventLiveComment",
  localField: "_id",
  foreignField: "eventId",
  justOne: false,
});
eventSchema.index({location: "2dsphere"});

const Event = mongoose.model("event", eventSchema);
export default Event;
