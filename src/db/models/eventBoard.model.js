import mongoose from 'mongoose'

const eventBoardSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    content: {
      type: String
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'event'
    },
  },
  {
    timestamp: true
  }
)

const EventBoard = mongoose.model('eventBoard', eventBoardSchema)

export default EventBoard
