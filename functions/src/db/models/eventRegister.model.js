import mongoose from "mongoose";

const eventRegisterSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: true,
      },
    },
    {
      timestamp: true,
    }
);

const EventRegister = mongoose.model(
    "eventRegister",
    eventRegisterSchema
);

export default EventRegister;
