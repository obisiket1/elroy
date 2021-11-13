import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
    },
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "event",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("report", ReportSchema);

export default Report;
