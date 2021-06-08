import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
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

const Category = mongoose.model('category', categorySchema)

export default Category
