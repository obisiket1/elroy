import { check, validationResult } from 'express-validator'
import Response from '../utils/response.utils'

/**
 * Contains Params Validations
 *
 * @class ParamsValidator
 */
export default class interestValidator {
  /**
   * @returns {Array} Array of errors if category data is invalid
   * @returns {EmptyArray} Empty array if category data is valid
   */
  static validateInterestCreationData () {
    return [
      check('name')
        .exists()
        .withMessage('Category name is required')
        .isString()
        .withMessage('Category name must be a string')
        .not()
        .isEmpty()
        .withMessage('Category name cannot be empty')
    ]
  }

  static validateInterestDeletionData () {
    return [
      check('categoryIds')
        .exists()
        .withMessage('Category ids are required')
        .isArray({ min: 1 })
        .withMessage('Category ids must be a non-empty array')
    ]
  }

  /**
   * @returns {JSON} JSON error object if req contains error
   * @returns {next} - passes control to next function if req contains no error
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static interestValidationResult (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg)
      return Response.InvalidRequestParamsError(res, errArr)
    }
    return next()
  }
}
