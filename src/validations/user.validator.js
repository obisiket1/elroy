import { check, validationResult, body } from "express-validator";
import Response from "../utils/response.utils";
import HelperUtils from "../utils/helpers.utils";

/**
 * Contains User Validators
 *
 * @class UserValidators
 */
export default class UserValidators {
  /**
   * @returns {Object} error object with errors arrays if user data is invalid
   */
  static validateEditUserData() {
    return [
      check("firstName")
        .optional()
        .isString()
        .withMessage("First name must be a string")
        .not()
        .isEmpty()
        .withMessage("First name cannot be empty"),
      check("lastName")
        .optional()
        .isString()
        .withMessage("Last name must be a string")
        .not()
        .isEmpty()
        .withMessage("Last name cannot be empty"),
      check("email")
        .not()
        .exists()
        .withMessage("Email cannot be changed directly"),
      check("password")
        .not()
        .exists()
        .withMessage("Cannot change password through this endpoint"),
      check("phoneNumber").isString().withMessage("Phone should be a string"),
      check("role")
        .optional()
        .isString()
        .withMessage("Role must be a string")
        .not()
        .isEmpty()
        .withMessage("Role cannot be empty")
        .custom(HelperUtils.validateMongooseId("Role")),
    ];
  }

  /**
   * @returns {JSON} JSON error object if user contains invalid data
   * @returns {next} - passes control to next function if all user data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static editUserValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }

  /**
   * @returns {Object} error object with errors arrays if password change data is invalid
   */
  static validateChangePasswordData() {
    return [
      check("oldPassword")
        .exists()
        .withMessage("Old password is required")
        .isString()
        .withMessage("Old password must be a string")
        .isLength({ min: 8 })
        .withMessage("Old password length must be at least 8 characters")
        .trim(),
      check("newPassword")
        .exists()
        .withMessage("New password is required")
        .isString()
        .withMessage("New password must be a string")
        .isLength({ min: 8 })
        .withMessage("New password length must be at least 8 characters")
        .trim(),
      body().custom((b) => {
        if (b.oldPassword !== b.newPassword) return true;
        throw new Error("New password cannot be the same as old password");
      }),
    ];
  }

  static validateInterestsData() {
    return [
      check("categoryIds")
        .exists()
        .withMessage("Category ids are required")
        .isArray()
        .withMessage("Category ids must be an array")
        .custom((val) => {
          if (val.length > 0) return true;
          throw new Error("Category ids must be a non-empty array");
        }),
    ];
  }

  /**
   * @returns {JSON} JSON error object if password creation contains invalid data
   * @returns {next} - passes control to next function if all password creation data are valid
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static changePasswordValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
