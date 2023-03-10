import {check, validationResult} from "express-validator";
import Response from "../utils/response.utils.js";
import HelperUtils from "../utils/helpers.utils.js";

/**
 * Contains Params Validations
 *
 * @class ParamsValidator
 */
export default class ParamsValidator {
  /**
     * @return {Array} Array of errors if mongooseID is invalid
     * @return {EmptyArray} Empty array if mongooseID is valid
     * @param {*} param Name of expected mongoose id parameter
     */
  static validateMongooseId(param) {
    return [
      check(param)
          .custom(HelperUtils.validateMongooseId(param)),
    ];
  }

  /**
   * @return {JSON} JSON error object if req contains error
   * @return {next} - passes control to next function if req contains no error
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static mongooseIdValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({msg}) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
