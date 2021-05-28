import { check, body, oneOf, validationResult } from 'express-validator'
import Response from '../utils/response.utils'

/**
 * Contains Params Validations
 *
 * @class ParamsValidator
 */
export default class EventsValidator {
  /**
   * @returns {Array} Array of errors if mongooseID is invalid
   * @returns {EmptyArray} Empty array if mongooseID is valid
   * @param {*} param Name of expected mongoose id parameter
   */
  static validateEventCreationData () {
    return [
      check('title')
        .exists()
        .withMessage('Event title is required')
        .isString()
        .withMessage('Event title must be a string')
        .not()
        .isEmpty()
        .withMessage('Event title cannot be empty'),
      check('host')
        .exists()
        .withMessage('Event host is required'),
      check('description')
        .exists()
        .withMessage('Event description is required')
        .isString()
        .withMessage('Event description must be a string')
        .not()
        .isEmpty()
        .withMessage('Event description cannot be empty')
        .custom(desc => {
          if (desc.length <= 100) return true
          else
            throw new Error(
              'Description length should be at least 100 characters'
            )
        }),
      check('category')
        .exists()
        .withMessage('Event category is required')
        .isString()
        .withMessage('Event category must be a string')
        .not()
        .isEmpty()
        .withMessage('Event category cannot be empty'),
      check('startDate')
        .exists()
        .withMessage('Event start date is required')
        .isDate()
        .withMessage('Event start date must be a date')
        .custom(date => {
          if (new Date(date) <= new Date())
            throw new Error('Event start date must be a future date')
          else return true
        }),
      check('endDate')
        .exists()
        .withMessage('Event end date is required')
        .isDate()
        .withMessage('Event end date must be a date')
        .custom(date => {
          if (new Date(date) <= new Date())
            throw new Error('End end date must be a future date')
          else return true
        }),
      check('attendanceLimit')
        .isNumeric()
        .withMessage('Attendance limit must be a number'),
      body().custom(body => {
        if ((body.requirePassword && body.password) || !body.requirePassword) {
          return true
        } else {
          throw new Error(
            'Password must be provided for a password protected event'
          )
        }
      }),
      body().custom(body => {
        if (body.startDate < body.endDate) {
          return true
        } else {
          throw new Error('Event start date must be before end date')
        }
      })
    ]
  }

  static validateEventsDeletionData () {
    return [
      check('EventIds')
        .exists()
        .withMessage('Event ids is required')
        .not()
        .isString()
        .withMessage('Event ids must be a nonstring array')
        .isArray({ min: 1 })
        .withMessage('Event ids must be an unempty array')
    ]
  }

  /**
   * @returns {JSON} JSON error object if req contains error
   * @returns {next} - passes control to next function if req contains no error
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static EventValidationResult (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg)
      return Response.InvalidRequestParamsError(res, errArr)
    }
    return next()
  }
}
