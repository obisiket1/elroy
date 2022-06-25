import Categories from '../db/models/category.model.js'
import Response from '../utils/response.utils.js'

export default class CategoriesController {
  static async createCategory (req, res) {
    try {
      const { name } = req.body
      const { id: userId } = req.data
      const category = await Categories.create({ name, userId })

      Response.Success(res, { category })
    } catch (err) {
      Response.InternalServerError(res, 'Error creating category')
    }
  }
  static async editCategory (req, res) {
    try {
      const { name } = req.body
      const { categoryId } = req.params
      const category = await Categories.findByIdAndUpdate(
        categoryId,
        { name },
        { returnOriginal: false }
      )

      Response.Success(res, { category })
    } catch (err) {
      Response.InternalServerError(res, 'Error editing category')
    }
  }

  static async fetchCategories (req, res) {
    try {
      const categories = await Categories.find()

      Response.Success(res, { categories })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching categories')
    }
  }

  static async deleteCategory (req, res) {
    try {
      const { categoryId } = req.params
      await Categories.findByIdAndDelete(categoryId)

      Response.Success(res, { message: 'category deleted successfully' })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting category')
    }
  }

  static async deleteCategories (req, res) {
    try {
      const { categoryIds } = req.body
      await Categories.deleteMany({ _id: { $in: categoryIds } })

      Response.Success(res, { message: 'categories deleted successfully' })
    } catch (err) {
      Response.InternalServerError(res, 'Error deleting categories')
    }
  }
}
