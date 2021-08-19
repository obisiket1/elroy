import mongoose from 'mongoose'

const eventLikeSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "event"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user"
    }
  },
  {
    timestamps: true
  }
)

const EventLike = mongoose.model('eventLike', eventLikeSchema)
export default EventLike