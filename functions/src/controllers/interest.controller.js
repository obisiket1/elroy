import Interests from '../db/models/interests.model.js'
import Response from '../utils/response.utils.js'

export default class InterestsController {
  static async createCategory (req, res) {
    try {
      const { name } = req.body
      const { id: userId } = req.data
      const category = await Interests.create({ name, userId })

      Response.Success(res, { category })
    } catch (err) {
      Response.InternalServerError(res, 'Error creating category')
    }
  }
  static async editCategory (req, res) {
    try {
      const { name } = req.body
      const { categoryId } = req.params
      const category = await Interests.findByIdAndUpdate(
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
      const interests = await Interests.find()

      Response.Success(res, { interests })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching interests')
    }
  }

  static async deleteCategory (req, res) {
    try {
      const { categoryId } = req.params
      await Interests.findByIdAndDelete(categoryId)

      Response.Success(res, { message: 'category deleted successfully' })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting category')
    }
  }

  static async deleteInterests (req, res) {
    try {
      const { categoryIds } = req.body
      await Interests.deleteMany({ _id: { $in: categoryIds } })

      Response.Success(res, { message: 'Interests deleted successfully' })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting Interests')
    }
  }
}
