import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Defines helper functions for the user model
 */
export default class UserUtils {

  /**
   * Encrypts plain text password
   * @param {*} password
   * @returns {string} hashed password
   */
  static async encryptPassword(password) {
    const pass = await bcrypt.hash(password, 8);
    return pass;
  }

  /**
   * Generates a new token for a particular user
   * @param {string} id
   * @param {string} role
   * @param {string} firstName
   * @param {string} lastName
   * @returns {string} token
   */
  static generateToken(id, firstName) {
    return jwt.sign(
      {
        data: { id, firstName },
      },
      process.env.SECRET,
      { expiresIn: '30d' },
    );
  }

  /**
   * Set cookie on response header
   * @param {ServerResponse} res
   * @param {string} userToken
   * @returns {undefined}
   */
  static setCookie(res, userToken) {
    res.cookie('token', userToken, {
      expires: new Date(Date.now() + 604800 * 1000),
      httpOnly: true,
      secure: true,
    });
  }

  /**
   * Verifies that the passwords are the same
   * @param {*} plainText
   * @param {*} hashedText
   * @returns {Boolean} returns true if passwords match
   */
  static async verifyPassword(plainText, hashedText) {
    return await bcrypt.compare(plainText, hashedText);
  }
}
