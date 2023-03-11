import {check, body} from "express-validator";

const boardTypes = ["note", "document", "image", "video", "audio"];
/**
 * Contains Params Validations
 *
 * @class ParamsValidator
 */
export default class EventBoardValidator {
  /**
   * @return {Array} Array of errors if mongooseID is invalid
   * @return {EmptyArray} Empty array if mongooseID is valid
   * @param {*} param Name of expected mongoose id parameter
   */
  static validateEventBoardData() {
    return [
      //   check('content')
      //     .exists()
      //     .withMessage('Board content is required'),
      check("name")
          .exists()
          .withMessage("Board name is required")
          .isString()
          .withMessage("Board name must be a string")
          .not()
          .isEmpty()
          .withMessage("Board name cannot be empty"),
      check("type")
          .exists()
          .withMessage("Board type is required")
          .isString()
          .withMessage("Board type must be a string")
          .not()
          .isEmpty()
          .withMessage("Board type cannot be empty")
          .custom((type) => {
            if (type && boardTypes.includes(type)) {
              return true;
            }
            throw new Error(
                "Board type must be 'note', 'audio', 'video', 'document', or 'image'"
            );
          }),
      check("content")
          .optional()
          .isString()
          .withMessage("Board content must be a string")
          .not()
          .isEmpty()
          .withMessage("Board content cannot be empty"),
      body().custom((body) => {
        if (body.type === "note" && !body.content) {
          throw new Error("No note provided");
        } else {
          return true;
        }
      }),
    ];
  }

  // eslint-disable-next-line require-jsdoc
  static validateEventBoardsDeletionData() {
    return [
      //   check('content')
      //     .exists()
      //     .withMessage('Board content is required'),
      check("eventBoardIds")
          .exists()
          .withMessage("Board ids is required")
          .not()
          .isString()
          .withMessage("Board ids must be a nonstring array")
          .isArray({min: 1})
          .withMessage("Board ids must be an unempty array"),
    ];
  }
}
