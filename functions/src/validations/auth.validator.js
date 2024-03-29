import { check, validationResult } from "express-validator";
import Response from "../utils/response.utils.js";

/**
 *Contains Login Validator
 *
 *
 *
 * @class Login
 */
class Auth {
  /**
   * validate user data.
   * @memberof Login
   * @returns {null} - No response.
   */
  static validateLoginData() {
    return [
      check("email")
        .exists()
        .withMessage("Email is required")
        .not()
        .isEmpty()
        .withMessage("Email cannot be empty")
        .isString()
        .withMessage("Email should be a string")
        .isEmail()
        .withMessage("Email is not a valid email address"),
      check("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password should be a string")
        .not()
        .isEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 8 })
        .withMessage("Password length should be at least 8 characters with a mixture of Upper and Lower case characters")
        .trim()
        .escape(),
    ];
  }

  /**
   * Validate user data.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @param {Response} next - The next parameter.
   * @memberof Login
   * @returns {JSON} - A JSON success response.
   */
  static async loginValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }

  static validateSignupData() {
    return [
      check("firstName")
        .exists()
        .withMessage("First name is required")
        .isString()
        .withMessage("First name should be a string")
        .not()
        .isEmpty()
        .withMessage("First name cannot be empty"),
      check("lastName")
        .exists()
        .withMessage("Last name is required")
        .isString()
        .withMessage("Last name should be a string")
        .not()
        .isEmpty()
        .withMessage("Last name cannot be empty"),
      check("email")
        .exists()
        .withMessage("Email is required")
        .isString()
        .withMessage("Email should be a string")
        .not()
        .isEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Email is not a valid email address"),
      check("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password should be a string")
        .not()
        .isEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 8 })
        .withMessage("Password length should be at least 8 characters with a mixture of Upper and Lower case characters")
        .trim()
        .escape(),
      check("phoneNumber").isString().withMessage("Phone should be a string"),
    ];
  }

  /**
   * Validate user data.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @param {Response} next - The next parameter.
   * @memberof Login
   * @returns {JSON} - A JSON success response.
   */
  static async signupValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
export default Auth;
