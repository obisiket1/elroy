import {check, body, validationResult} from "express-validator";
import Response from "../utils/response.utils.js";
import Helper from "../utils/helpers.utils.js";

/**
 * Contains Params Validations
 *
 * @class ParamsValidator
 */
export default class EventsValidator {
  /**
   * @return {Array} Array of errors if mongooseID is invalid
   * @return {EmptyArray} Empty array if mongooseID is valid
   * @param {*} param Name of expected mongoose id parameter
   */
  static validateEventCreationData() {
    return [
      check("title")
          .exists()
          .withMessage("Event title is required")
          .isString()
          .withMessage("Event title should be a string")
          .not()
          .isEmpty()
          .withMessage("Event title cannot be empty"),
      check("startTime")
          .optional()
          .isString()
          .withMessage("Event title should be a string")
          .not()
          .isEmpty()
          .withMessage("Event title cannot be empty"),
      check("description")
          .exists()
          .withMessage("Event description is required")
          .isString()
          .withMessage("Event description should be a string")
          .not()
          .isEmpty()
          .withMessage("Event description cannot be empty")
          .isLength({max: 3000})
          .withMessage(
              "Event description should be at least 100 characters long"
          ),
      check("categoryId")
          .exists()
          .withMessage("Event category is required")
          .custom(Helper.validateMongooseId("Event category")),
      check("startDate")
          .exists()
          .withMessage("Event start date is required")
          .isDate()
          .withMessage("Event start date should be a date")
          .custom((date) => {
            if (new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))) {
              throw new Error("Event start date should be a future date");
            } else return true;
          }),
      check("endDate")
          .exists()
          .withMessage("Event end date is required")
          .isDate()
          .withMessage("Event end date should be a date")
          .custom((date) => {
            if (new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))) {
              throw new Error("End end date should be a future date");
            } else return true;
          }),
      check("location")
          .optional()
          .isObject()
          .withMessage("Location should be an object"),
      check("isPublished")
          .optional()
          .isBoolean()
          .withMessage("IsPublished should be a boolean"),
      body().custom((body) => {
        if (body.requirePassword && !body.password) {
          throw new Error(
              "Password should be provided for a password protected event"
          );
        } else {
          return true;
        }
      }),
      body().custom((body) => {
        console.log(body.startDate, body.endDate);
        if (body.startDate <= body.endDate) {
          return true;
        } else {
          throw new Error("Event start date should be before end date");
        }
      }),
    ];
  }

  // eslint-disable-next-line require-jsdoc
  static validateEventRegisterData() {
    return [
      check("firstName")
          .exists()
          .withMessage("First Name is required")
          .isString()
          .withMessage("First Name should be a string")
          .not()
          .isEmpty()
          .withMessage("First Name cannot be empty"),
      check("lastName")
          .exists()
          .withMessage("Last Name is required")
          .isString()
          .withMessage("Last Name should be a string")
          .not()
          .isEmpty()
          .withMessage("Last Name cannot be empty"),
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
    ];
  }

  // eslint-disable-next-line require-jsdoc
  static validateEventEditionData() {
    return [
      check("userId")
          .not()
          .exists()
          .withMessage("Event userId cannot be changed"),
      check("eventId")
          .exists()
          .withMessage("Event id is required")
          .custom(Helper.validateMongooseId("Event id")),
      check("title")
          .exists()
          .withMessage("Event title is required")
          .isString()
          .withMessage("Event title should be a string")
          .not()
          .isEmpty()
          .withMessage("Event title cannot be empty"),
      check("description")
          .exists()
          .withMessage("Event description is required")
          .isString()
          .withMessage("Event description should be a string")
          .not()
          .isEmpty()
          .withMessage("Event description cannot be empty")
          .isLength({max: 3000})
          .withMessage(
              "Event description should be at least 100 characters long"
          ),
      check("categoryId")
          .exists()
          .withMessage("Event category is required")
          .custom(Helper.validateMongooseId("Event category")),
      check("startDate")
          .exists()
          .withMessage("Event start date is required")
          .isDate()
          .withMessage("Event start date should be a date")
          .custom((date) => {
            if (new Date(date) < new Date()) {
              throw new Error("Event start date should be a future date");
            } else return true;
          }),
      check("endDate")
          .exists()
          .withMessage("Event end date is required")
          .isDate()
          .withMessage("Event end date should be a date")
          .custom((date) => {
            if (new Date(date) < new Date()) {
              throw new Error("End end date should be a future date");
            } else return true;
          }),
      check("usePersonalId")
          .optional()
          .isBoolean()
          .withMessage("Use personal id should be boolean"),
      body().custom((body) => {
        if ((body.requirePassword && body.password) || !body.requirePassword) {
          return true;
        } else {
          throw new Error(
              "Password should be provided for a password protected event"
          );
        }
      }),
      body().custom((body) => {
        if (body.startDate < body.endDate) {
          return true;
        } else {
          throw new Error("Event start date should be before end date");
        }
      }),
    ];
  }

  // eslint-disable-next-line require-jsdoc
  static validateEventUpdateData() {
    return [
      check("userId")
          .not()
          .exists()
          .withMessage("Event userId cannot be changed"),
      check("eventId").optional().custom(Helper.validateMongooseId("Event id")),
      check("title")
          .optional()
          .isString()
          .withMessage("Event title should be a string")
          .not()
          .isEmpty()
          .withMessage("Event title cannot be empty"),
      check("description")
          .optional()
          .isString()
          .withMessage("Event description should be a string")
          .not()
          .isEmpty()
          .withMessage("Event description cannot be empty")
          .isLength({max: 3000})
          .withMessage(
              "Event description should be at least 100 characters long"
          ),
      check("categoryId")
          .optional()
          .custom(Helper.validateMongooseId("Event category")),
      check("startDate")
          .optional()
          .isDate()
          .withMessage("Event start date should be a date")
          .custom((date) => {
            if (new Date(date) <= new Date()) {
              throw new Error("Event start date should be a future date");
            } else return true;
          }),
      check("endDate")
          .optional()
          .isDate()
          .withMessage("Event end date should be a date")
          .custom((date) => {
            if (new Date(date) <= new Date()) {
              throw new Error("End end date should be a future date");
            } else return true;
          }),
      check("usePersonalId")
          .optional()
          .isBoolean()
          .withMessage("Use personal id should be boolean"),
      body().custom((body) => {
        if ((body.requirePassword && body.password) || !body.requirePassword) {
          return true;
        } else {
          throw new Error(
              "Password should be provided for a password protected event"
          );
        }
      }),
      body().custom((body) => {
        if (!body.startDate || body.startDate < body.endDate) {
          return true;
        } else {
          throw new Error("Event start date should be before end date");
        }
      }),
      body().custom((body) => {
        const keys = Object.keys(body);
        if (keys.length) return true;
        throw new Error("No payload provided for update");
      }),
    ];
  }

  // eslint-disable-next-line require-jsdoc
  static validateEventsDeletionData() {
    return [
      check("EventIds")
          .exists()
          .withMessage("Event ids is required")
          .not()
          .isString()
          .withMessage("Event ids should be a nonstring array")
          .isArray({min: 1})
          .withMessage("Event ids should be an unempty array"),
    ];
  }

  // eslint-disable-next-line require-jsdoc
  static validateEventsFetchData() {
    return [
      check("lat")
          .optional()
          .custom((lat) => {
            if (!isNaN(parseFloat(lat))) return true;
            else {
              throw new Error("Latitude should be a number");
            }
          }),
      check("lng")
          .optional()
          .custom((lng) => {
            if (!isNaN(parseFloat(lng))) return true;
            else {
              throw new Error("Longitude should be a number");
            }
          }),
      check("rad")
          .optional()
          .custom((rad) => {
            if (!isNaN(parseFloat(rad))) return true;
            else {
              throw new Error("Radius should be a number");
            }
          }),
      check("categoryIds")
          .optional()
          .isArray({min: 1})
          .withMessage(
              "Category ids must be an array with at least one category id"
          ),
    ];
  }

  /**
   * @return {JSON} JSON error object if req contains error
   * @return {next} - passes control to next function if req contains no error
   * @param {*} req - Request Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   */
  static EventValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({msg}) => msg);
      // eslint-disable-next-line new-cap
      return Response.InvalidRequestParamsError(res, errArr);
    }
    return next();
  }
}
