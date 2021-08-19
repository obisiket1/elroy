import mongoose from 'mongoose'

const eventReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    rating: {
      type: Number
    },
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

const EventReview = mongoose.model('eventReview', eventReviewSchema)
export default EventReview
