import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: String,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    role: {
      type: mongoose.Schema.ObjectId,
      ref: 'role',
    },
    googleUserId: {
      type: String,
      trim: true,
    },
    referralCode: {
      type: String,
      trim: true,
    },
    referee: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    profilePhotoUrl: {
      type: String,
    },
  },
  {
    timestamps: true
  },
);

const User = mongoose.model('user', UserSchema);

export default User;
