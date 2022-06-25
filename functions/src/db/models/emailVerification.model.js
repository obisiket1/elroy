import mongoose from "mongoose";

const emailVerificationSchema = mongoose.Schema({
  email: String,
  code: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "60m",
  },
});

const emailVerificationModel = mongoose.model(
    "emailVerification",
    emailVerificationSchema
);

export default emailVerificationModel;
