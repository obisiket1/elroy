/**
 * Defines reusable responses
 */
export default class {
  /**
   * Defines the specification for the "unauthorized error" response cases
   * @param {Object} res
   * @param {Object} error
   * @param {number} code
   * @return {Object} response
   */
  static UnauthorizedError(res, error, code = 401) {
    return res.status(code).json({
      status: "error",
      error,
    });
  }

  /**
   * Defines the specification for the "success" response cases
   * @param {Object} res
   * @param {Object} data
   * @param {number} code
   * @return {ServerResponse} response
   */
  static Success(res, data, code = 200) {
    return res.status(code).json({
      status: "success",
      data,
    });
  }

  /**
     * Defines the specification for internal server error
     * @param {Object} res
     * @param {Object|string} error
     * @return {Object} response
     */
  static InternalServerError(res, error) {
    return res.status(500).json({
      status: "error",
      error,
    });
  }

  /**
   * Defines the specification for conflicting resource
   * @param {object} res (ServerResponse)
   * @param {object} error
   * @return {object} ServerResponse
   */
  static ConflictError(res, error) {
    return res.status(409).json({
      status: "error",
      error,
    });
  }

  /**
   * Defines the specification for a resource not found error
   * @param {object} res (ServerResponse)
   * @param {string} error
   * @return {object} ServerResponse
   */
  static NotFoundError(res, error) {
    return res.status(404).json({
      status: "error",
      error,
    });
  }

  /**
   * Defines the specification for bad request error cases
   * @param {object} res (ServerResponse object)
   * @param {object} error
   * @param {number} code
   * @return {object} ServerResponse
   */
  static BadRequestError(res, error, code = 400) {
    return res.status(code).json({
      status: "error",
      error,
    });
  }

  /**
   * Defines the specification for invalid request params error cases
   * @param {*} res (ServerResponse object)
   * @param {*} errors
   * @param {*} error
   * @return {json} (Error details)
   */
  static InvalidRequestParamsError(res, errors, error = "Your request contains invalid parameters") {
    return res.status(400).json({
      status: "error",
      error,
      errors,
    });
  }
}
