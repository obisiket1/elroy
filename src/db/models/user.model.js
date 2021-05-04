import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    password: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: String
    },
    state: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      trim: true
    },
    role: {
      type: mongoose.Schema.ObjectId,
      ref: 'role'
    },
    googleUserId: {
      type: String,
      trim: true
    },
    facebookUserId: {
      type: String,
      trim: true
    },
    profilePhotoUrl: {
      type: String
    },
    interests: [{ type: 'ObjectId' }],
    isActivated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('user', UserSchema)

export default User
