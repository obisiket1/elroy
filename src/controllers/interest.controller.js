import Interests from '../db/models/interest.model'
import Response from '../utils/response.utils'

export default class InterestsController {
  static async createInterest (req, res) {
    try {
      const { name } = req.body
      const { id: creatorId } = req.data
      const interest = await Interests.create({ name, creatorId })

      Response.Success(res, { interest })
    } catch (err) {
      Response.InternalServerError(res, 'Error creating interest')
    }
  }
  static async editInterest (req, res) {
    try {
      const { name } = req.body
      const { interestId } = req.params
      const interest = await Interests.findByIdAndUpdate(
        interestId,
        { name },
        { returnOriginal: false }
      )

      Response.Success(res, { interest })
    } catch (err) {
      Response.InternalServerError(res, 'Error editing interest')
    }
  }
}
