import mongoose from 'mongoose'

const FollowSchema = new mongoose.Schema(
  {
    followingUserId: {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    },
    followedUserId: {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    }
  },
  {
    timestamps: true
  }
)

const Follow = mongoose.model('userFollow', FollowSchema)

export default Follow
