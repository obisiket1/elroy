/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import jwt from "jsonwebtoken";
import Response from "../utils/response.utils.js";

/**
 *Contains Auth Middlewares
 *
 *
 * @class AuthMiddleware
 */
class AuthMiddleware {
  /**
   * @memberof AuthMiddleware
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @param {*} next - Passes control to next function
   * @return {JSON} Error response if no token provided or token is invalid
   * @return {JSON} passes control to the next function
   */
  static validateToken(req, res, next) {
    const {token: headerToken = null} = req.headers;
    const {token: queryToken = null} = req.query;

    const token = queryToken || headerToken || req.headers["x-access-token"];

    if (!token) {
      return Response.UnauthorizedError(res, "Not authorized to access data");
    }
    jwt.verify(token, process.env.SECRET, (error, result) => {
      if (error) {
        return Response.UnauthorizedError(res, "Not authorized to access data");
      }
      console.log(result);
      req.data = result.data;
      return next();
    });
  }

  static extractLoginData() {
    return (req, res, next) => {
      try {
        req.data = {};
        const {token: headerToken = null} = req.headers;
        const {token: queryToken = null} = req.query;

        const token = queryToken || headerToken || req.headers["x-access-token"];

        if (!token) {
          return next();
        }
        jwt.verify(token, process.env.SECRET, (error, result) => {
          if (error) {
            return next();
          }
          req.data = result.data;
          return next();
        });
      } catch (err) {
        Response.InternalServerError(res, err);
      }
    };
  }

  /**
   * @memberof AuthMiddleware
   * @param {*} role - The minimum level permitted to access  data
   * @return {JSON} Error response if user is not up to level
   * @return {JSON} passes control to the next function
   */
  static grantAccess(role = "608ebc0a8673c637b45fbc42") {
    // const roles = ['608ebc0a8673c637b45fbc42', '608ebc218673c637b45fbc43']
    // const roleIndex = roles.findIndex(val => val === role)
    return (_, __, next) => {
      // if (
      //   roleIndex < 0 ||
      //   roles.findIndex(val => val === req.data.role) < roleIndex
      // ) {
      //   return Response.UnauthorizedError(res, 'Not authorized to access data')
      // }
      return next();
    };
  }
}

export default AuthMiddleware;
