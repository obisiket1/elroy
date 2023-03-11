import mongoose from "mongoose";

const eventAttenderSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: true,
      },
      name: String,
      attendedEvent: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: "24h",
      },
    },
    {
      timestamp: true,
    }
);

const EventAttender = mongoose.model("eventAttender", eventAttenderSchema);

export default EventAttender;
