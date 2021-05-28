import category from '../db/models/category.model'
import categories from '../db/models/category.model'
import Response from '../utils/response.utils'

export default class InterestsController {
  static async createInterest (req, res) {
    try {
      const { name } = req.body
      const { id: creatorId } = req.data
      const category = await categories.create({ name, creatorId })

      Response.Success(res, { category })
    } catch (err) {
      Response.InternalServerError(res, 'Error creating category')
    }
  }
  static async editInterest (req, res) {
    try {
      const { name } = req.body
      const { categoryId } = req.params
      const category = await categories.findByIdAndUpdate(
        categoryId,
        { name },
        { returnOriginal: false }
      )

      Response.Success(res, { category })
    } catch (err) {
      Response.InternalServerError(res, 'Error editing category')
    }
  }

  static async fetchInterests (req, res) {
    try {
      const categories = await categories.find()

      Response.Success(res, { categories })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching categories')
    }
  }

  static async deleteInterest (req, res) {
    try {
      const { categoryId } = req.params
      await categories.findByIdAndDelete(categoryId)

      Response.Success(res, { message: 'category deleted successfully' })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting category')
    }
  }

  static async deleteInterests (req, res) {
    try {
      const { categoryIds } = req.body
      await categories.deleteMany({ _id: { $in: categoryIds } })

      Response.Success(res, { message: 'categories deleted successfully' })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting categories')
    }
  }
}
