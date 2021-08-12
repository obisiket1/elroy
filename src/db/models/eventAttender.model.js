import mongoose from 'mongoose'

const eventAttenderSchema = new mongoose.Schema(
  {
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

const EventAttender = mongoose.model('eventAttender', eventAttenderSchema)

export default EventAttender
