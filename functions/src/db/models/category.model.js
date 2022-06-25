import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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

const Category = mongoose.model("category", categorySchema);

export default Category;
