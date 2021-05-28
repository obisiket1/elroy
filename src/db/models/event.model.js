import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  host: {
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
  backgroundImage: String,
})

const Event = mongoose.model('event', eventSchema)
export default Event
