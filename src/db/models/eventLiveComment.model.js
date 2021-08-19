import mongoose from 'mongoose'

const eventLiveCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'event',
      required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h'
    }
  },
  {
    timestamp: true
  }
)

const EventLiveComment = mongoose.model(
  'eventLiveComment',
  eventLiveCommentSchema
)

export default EventLiveComment
