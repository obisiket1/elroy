import { check, body, validationResult } from 'express-validator'
import Response from '../utils/response.utils'
import Helper from '../utils/helpers.utils'

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
        .withMessage('Event title should be a string')
        .not()
        .isEmpty()
        .withMessage('Event title cannot be empty'),
      check('creator')
        .exists()
        .withMessage('Event creator is required')
        .custom(Helper.validateMongooseId('Event host')),
      check('description')
        .exists()
        .withMessage('Event description is required')
        .isString()
        .withMessage('Event description should be a string')
        .not()
        .isEmpty()
        .withMessage('Event description cannot be empty')
        .isLength({ min: 100 })
        .withMessage(
          'Event description should be at least 100 characters long'
        ),
      check('category')
        .exists()
        .withMessage('Event category is required')
        .custom(Helper.validateMongooseId('Event category')),
      check('startDate')
        .exists()
        .withMessage('Event start date is required')
        .isDate()
        .withMessage('Event start date should be a date')
        .custom(date => {
          if (new Date(date) <= new Date())
            throw new Error('Event start date should be a future date')
          else return true
        }),
      check('endDate')
        .exists()
        .withMessage('Event end date is required')
        .isDate()
        .withMessage('Event end date should be a date')
        .custom(date => {
          if (new Date(date) <= new Date())
            throw new Error('End end date should be a future date')
          else return true
        }),
      check('attendanceLimit')
        .isNumeric()
        .withMessage('Attendance limit should be a number'),
      body().custom(body => {
        if ((body.requirePassword && body.password) || !body.requirePassword) {
          return true
        } else {
          throw new Error(
            'Password should be provided for a password protected event'
          )
        }
      }),
      body().custom(body => {
        if (body.startDate < body.endDate) {
          return true
        } else {
          throw new Error('Event start date should be before end date')
        }
      })
    ]
  }

  static validateEventEditionData () {
    return [
      check('creator')
        .not()
        .exists()
        .withMessage('Event creator cannot be changed'),
      check('_id')
        .exists()
        .withMessage('Event id is required')
        .custom(Helper.validateMongooseId('Event id')),
      check('title')
        .exists()
        .withMessage('Event title is required')
        .isString()
        .withMessage('Event title should be a string')
        .not()
        .isEmpty()
        .withMessage('Event title cannot be empty'),
      check('description')
        .exists()
        .withMessage('Event description is required')
        .isString()
        .withMessage('Event description should be a string')
        .not()
        .isEmpty()
        .withMessage('Event description cannot be empty')
        .isLength({ min: 5 })
        .withMessage(
          'Event description should be at least 100 characters long'
        ),
      check('category')
        .exists()
        .withMessage('Event category is required')
        .custom(Helper.validateMongooseId('Event category')),
      check('startDate')
        .exists()
        .withMessage('Event start date is required')
        .isDate()
        .withMessage('Event start date should be a date')
        .custom(date => {
          if (new Date(date) <= new Date())
            throw new Error('Event start date should be a future date')
          else return true
        }),
      check('endDate')
        .exists()
        .withMessage('Event end date is required')
        .isDate()
        .withMessage('Event end date should be a date')
        .custom(date => {
          if (new Date(date) <= new Date())
            throw new Error('End end date should be a future date')
          else return true
        }),
      check('attendanceLimit')
        .isNumeric()
        .withMessage('Attendance limit should be a number'),
      body().custom(body => {
        console.log(body)
        if ((body.requirePassword && body.password) || !body.requirePassword) {
          return true
        } else {
          throw new Error(
            'Password should be provided for a password protected event'
          )
        }
      }),
      body().custom(body => {
        if (body.startDate < body.endDate) {
          return true
        } else {
          throw new Error('Event start date should be before end date')
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
        .withMessage('Event ids should be a nonstring array')
        .isArray({ min: 1 })
        .withMessage('Event ids should be an unempty array')
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
