import mongoose from 'mongoose'

const RoleSchema = new mongoose.Schema(
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

const Role = mongoose.model('role', RoleSchema)

export default Role
