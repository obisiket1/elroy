import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    },
    description: String,
    location: Object,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'category'
    },
    startDate: Date,
    endDate: Date,
    attendanceLimit: Number,
    requirePassword: Boolean,
    password: String,
    requireAuthentication: Boolean,
    backgroundImage: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

eventSchema.virtual('boards', {
  ref: 'eventBoard',
  localField: '_id',
  foreignField: 'eventId',
  justOne: false
})
eventSchema.virtual('reviews', {
  ref: 'eventReview',
  localField: '_id',
  foreignField: 'eventId',
  justOne: false
})
eventSchema.virtual('liveComments', {
  ref: 'eventLiveComment',
  localField: '_id',
  foreignField: 'eventId',
  justOne: false
})

const Event = mongoose.model('event', eventSchema)
export default Event
