import mongoose from 'mongoose'
import geoSchema from '../schemas/geoLocation.schema'

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    creatorId: {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    },
    description: String,
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
    backgroundImage: String,
    location: geoSchema,
    attendanceLimit: Number,
    requirePassword: Boolean
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
eventSchema.index({ location: '2dsphere' })

const Event = mongoose.model('event', eventSchema)
export default Event
