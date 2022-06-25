import GeneralServices from '../services/general.services.js';
import category from '../db/models/category.model.js';

/**
 * category Middleware class
 * @class CategoryMiddleware
 */
export default class CategoryMiddleware {
  /**
   * Checks if category with the given name doesn't exist
   * @param {*} req Request
   * @param {*} res Response object
   * @param {*} next Passes control to next function
   * @returns {JSON} error if it exists
   * @returns {Function} (next) passes control to next function
   */
  static checkCategoryInexistence(req, res, next) {
    GeneralServices.checkDocInexistence(
      res,
      next,
      category,
      { name: req.body.name },
      'This category',
    );
  }

  /**
   * Checks if category with the given name exists
   * @param {*} req Request
   * @param {*} res Response object
   * @param {*} next Passes control to next function
   * @returns {JSON} error if it doesn't exist
   * @returns {Function} (next) Populates req.dbResult with fetched doc
   * and passes control to next function
   */
  static checkCategoryExistence(req, res, next) {
    GeneralServices.checkDocExistence(
      req,
      res,
      next,
      category,
      { _id: req.params.categoryId },
      'This category',
    );
  }
}
