import mongoose from 'mongoose'
import geoSchema from '../schemas/geoLocation.schema'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  },
  description: String,
  location: geoSchema,
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
})
eventSchema.index({ location: '2dsphere' })

const Event = mongoose.model('event', eventSchema)
export default Event
