import mongoose from 'mongoose'

const FollowSchema = new mongoose.Schema(
  {
    followingUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    },
    followedUser: {
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
