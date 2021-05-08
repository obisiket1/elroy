import Role from '../db/models/role.model'
import Roles from '../db/models/role.model'
import Response from '../utils/response.utils'

export default class RolesController {
  static async fetchRoles (req, res) {
    try {
      const roles = await Roles.find()

      Response.Success(res, { roles })
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching roles')
    }
  }
}
