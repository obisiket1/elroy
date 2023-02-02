import mongoose from "mongoose";

const eventLiveStreamSchema = new mongoose.Schema(
    {
      playbackIds: [{
        type: String,
        required: true,
      }],
      playbackPolicies: [{
        type: String,
      }],
      status: {
        type: String,
      },
      state: {
        type: String,
        default: "idle",
      },
      streamId: {
        type: String,
        required: true,
      },
      streamKey: {
        type: String,
        required: true,
        select: false,
      },
      title: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamp: true,
    }
);

const EventLiveStream = mongoose.model(
    "eventLiveStream",
    eventLiveStreamSchema
);

export default EventLiveStream;
