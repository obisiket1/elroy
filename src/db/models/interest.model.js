import mongoose from 'mongoose'

const InterestSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    creatorId: {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    }
  },
  {
    timestamps: true
  }
)

const Interest = mongoose.model('interest', InterestSchema)

export default Interest
