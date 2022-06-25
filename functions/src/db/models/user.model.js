import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const UserSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
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
        ref: "role",
      },
      googleUserId: {
        type: String,
        trim: true,
      },
      facebookUserId: {
        type: String,
        trim: true,
      },
      profilePhotoUrl: {
        type: String,
      },
      categoryIds: [{type: "ObjectId", ref: "category"}],
      emailVerified: {
        type: Boolean,
        default: false,
      },
      personalEventId: {type: String, default: uuid()},
    },
    {
      timestamps: true,
    }
);

UserSchema.virtual("followers", {
  ref: "follow",
  localField: "_id",
  foreignField: "followedUser",
  justOne: false,
});

UserSchema.virtual("following", {
  ref: "follow",
  localField: "_id",
  foreignField: "followingUser",
  justOne: false,
});

const User = mongoose.model("user", UserSchema);

export default User;
