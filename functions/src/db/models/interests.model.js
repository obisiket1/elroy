import mongoose from "mongoose";

const interestSchema = new mongoose.Schema(
    {
      name: {
        type: String,
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

const Interest = mongoose.model("interest", interestSchema);

export default Interest;
