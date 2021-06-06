import { check, validationResult } from 'express-validator'
import Response from '../utils/response.utils'
import Helpers from '../utils/helpers.utils'

/**
 * Contains Params Validations
 *
 * @class ParamsValidator
 */
export default class EventReviewsValidator {
  /**
   * @returns {Array} Array of errors if mongooseID is invalid
   * @returns {EmptyArray} Empty array if mongooseID is valid
   * @param {*} param Name of expected mongoose id parameter
   */
  static validateEventReviewData () {
    return [
      check('title')
        .exists()
        .withMessage('Review title is required')
        .isString()
        .withMessage('Review title must be a string')
        .not()
        .isEmpty()
        .withMessage('Review title cannot be empty'),
      check('comment')
        .exists()
        .withMessage('Review comment is required')
        .isString()
        .withMessage('Review comment must be a string')
        .not()
        .isEmpty()
        .withMessage('Review comment cannot be empty'),
      check('rating')
        .exists()
        .withMessage('Review rating is required')
        .isNumeric()
        .withMessage('Review rating must be a number')
        .not()
        .isEmpty()
        .withMessage('Review comment cannot be empty')
    ]
  }

  static validateEventReviewsDeletionData () {
    return [
      check('eventReviewIds')
        .exists()
        .withMessage('Review ids is required')
        .not()
        .isString()
        .withMessage('Review ids must be a nonstring array')
        .isArray({ min: 1 })
        .withMessage('Review ids must be an unempty array')
    ]
  }

  /**
   * @returns {JSON} JSON error object if req contains error
   * @returns {next} - passes control to next function if req contains no error
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static eventReviewValidationResult (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg)
      return Response.InvalidRequestParamsError(res, errArr)
    }
    return next()
  }
}
