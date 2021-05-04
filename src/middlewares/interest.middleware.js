import GeneralServices from '../services/general.services';
import Interest from '../db/models/interest.model';

/**
 * Interest Middleware class
 * @class InterestMiddleware
 */
export default class InterestMiddleware {
  /**
   * Checks if interest with the given name doesn't exist
   * @param {*} req Request
   * @param {*} res Response object
   * @param {*} next Passes control to next function
   * @returns {JSON} error if it exists
   * @returns {Function} (next) passes control to next function
   */
  static checkInterestInexistence(req, res, next) {
    GeneralServices.checkDocInexistence(
      res,
      next,
      Interest,
      { name: req.body.name },
      'This interest',
    );
  }

  /**
   * Checks if interest with the given name exists
   * @param {*} req Request
   * @param {*} res Response object
   * @param {*} next Passes control to next function
   * @returns {JSON} error if it doesn't exist
   * @returns {Function} (next) Populates req.dbResult with fetched doc
   * and passes control to next function
   */
  static checkInterestExistence(req, res, next) {
    GeneralServices.checkDocExistence(
      req,
      res,
      next,
      Interest,
      { _id: req.params.interestId },
      'This interest',
    );
  }
}
