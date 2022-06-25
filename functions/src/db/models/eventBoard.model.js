import mongoose from "mongoose";

const eventBoardSchema = mongoose.Schema(
    {
      type: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
      },
    },
    {
      timestamps: true,
    }
);

const EventBoard = mongoose.model("eventBoard", eventBoardSchema);

export default EventBoard;
