import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      content: {
        type: String,
        required: true,
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

const Note = mongoose.model("note", NoteSchema);

export default Note;
