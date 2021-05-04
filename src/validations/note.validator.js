import { check, validationResult } from 'express-validator'
import Response from '../utils/response.utils'
import HelperUtils from '../utils/helpers.utils'

/**
 * Contains Params Validations
 *
 * @class ParamsValidator
 */
export default class NotesValidator {
  /**
   * @returns {Array} Array of errors if mongooseID is invalid
   * @returns {EmptyArray} Empty array if mongooseID is valid
   * @param {*} param Name of expected mongoose id parameter
   */
  static validateNoteData () {
    return [
      check('title')
        .exists()
        .withMessage('Note title is required')
        .isString()
        .withMessage('Note title must be a string')
        .not()
        .isEmpty()
        .withMessage('Note title cannot be empty'),
      check('content')
        .exists()
        .withMessage('Note content is required')
        .isString()
        .withMessage('Note content must be a string')
        .not()
        .isEmpty()
        .withMessage('Note content cannot be empty')
    ]
  }

  static validateNotesDeletionData () {
    return [
      check('noteIds')
        .exists()
        .withMessage('Note ids is required')
        .not()
        .isString()
        .withMessage('Note ids must be a nonstring array')
        .isArray({ min: 1 })
        .withMessage('Note ids must be an unempty array')
    ]
  }

  /**
   * @returns {JSON} JSON error object if req contains error
   * @returns {next} - passes control to next function if req contains no error
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static noteValidationResult (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg)
      return Response.InvalidRequestParamsError(res, errArr)
    }
    return next()
  }
}
