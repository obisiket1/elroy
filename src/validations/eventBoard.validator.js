import { check } from 'express-validator'
import Helpers from '../utils/helpers.utils'

const boardTypes = ['note', 'document', 'image', 'video', 'audio']
/**
 * Contains Params Validations
 *
 * @class ParamsValidator
 */
export default class EventBoardValidator {
  /**
   * @returns {Array} Array of errors if mongooseID is invalid
   * @returns {EmptyArray} Empty array if mongooseID is valid
   * @param {*} param Name of expected mongoose id parameter
   */
  static validateEventBoardData () {
    return [
      //   check('content')
      //     .exists()
      //     .withMessage('Board content is required'),
      check('name')
        .exists()
        .withMessage('Board name is required')
        .isString()
        .withMessage('Board name must be a string')
        .not()
        .isEmpty()
        .withMessage('Board name cannot be empty'),
      check('type')
        .exists()
        .withMessage('Board type is required')
        .isString()
        .withMessage('Board type must be a string')
        .not()
        .isEmpty()
        .withMessage('Board type cannot be empty')
        .custom(type => {
          if (type && boardTypes.includes(type)) {
            return true
          }
          throw new Error(
            "Board type must be 'note', 'audio', 'video', 'document', or 'image'"
          )
        })
    ]
  }
}
