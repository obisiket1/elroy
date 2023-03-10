import {check, validationResult} from "express-validator";

/**
 * Contains Params Validations
 *
 * @class ParamsValidator
 */
export default class EventLiveCommentValidator {
  /**
   * @return {Array} Array of errors if mongooseID is invalid
   * @return {EmptyArray} Empty array if mongooseID is valid
   * @param {*} param Name of expected mongoose id parameter
   */
  static validateEventLiveCommentData() {
    return [
      check("content")
          .exists()
          .withMessage("Comment content is required")
          .isString()
          .withMessage("Comment content must be a string")
          .not()
          .isEmpty()
          .withMessage("Comment content cannot be empty"),
    ];
  }
}
