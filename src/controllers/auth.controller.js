import Users from '../db/models/user.model'
import Helper from '../utils/user.utils'
import Response from '../utils/response.utils'
import AuthServices from '../services/auth.services'
import EmailVerification from '../db/models/emailVerification.model'
import nodemailer from 'nodemailer'
const { google } = require('googleapis')

/**
 * Contains AuthController
 *
 * @class AuthController
 */
export default class AuthController {
  /**
   *
   * @param {*} req - Payload
   * @param {*} res - Response object
   * @returns {Response.Success} if no error occurs
   * @returns {Response.InternalServerError} if error occurs
   */
  static async signup (req, res) {
    try {
      const { firstName, lastName, password, email } = req.body

      const encryptedPassword = await Helper.encryptPassword(password)

      const user = {
        firstName,
        lastName,
        password: encryptedPassword,
        email
      }

      const result = await Users.create({ ...user })
      result.password = undefined

      // const code = await Helper.encryptPassword(email)

      // await EmailVerification.create({
      //   email,
      //   code
      // })

      const token = Helper.generateToken(user._id, user.firstName)
      Helper.setCookie(res, token)

      // const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
      // const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
      // const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI
      // const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN

      // const oAuth2Client = new google.auth.OAuth2(
      //   CLIENT_ID,
      //   CLIENT_SECRET,
      //   REDIRECT_URI
      // )
      // oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
      // const accessToken = await oAuth2Client.getAccessToken()

      // let transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     type: 'OAuth2',
      //     user: 'victoronwukwe25@gmail.com',
      //     clientId: CLIENT_ID,
      //     clientSecret: CLIENT_SECRET,
      //     refreshToken: REFRESH_TOKEN,
      //     accessToken
      //   }
      // })

      // await transporter.sendMail({
      //   from: 'Victor Onwukwe <victoronwukwe25@gmail.com>', // sender address
      //   to: `${email}`, // list of receivers
      //   subject: 'Elroi email verification', // Subject line
      //   html: `<div>
      //     Hello. Please follow this <a href='http://localhost:5000/api/v1/auth/verify-email?tkn=${code}&email=${email}'>link</a> to verify your email
      //   </div>` // plain text body
      // })

      return Response.Success(res, { user: result, token }, 201)
    } catch (err) {
      return Response.InternalServerError(res, 'Error signing up user')
    }
  }

  /**
   * Handles signIn requests
   * @param {ServerRequest} req
   * @param {ServerResponse} res
   * @returns {ServerResponse} response
   */
  static async login (req, res) {
    const signinError = 'Incorrect email or password'
    try {
      const user = await Users.findOne({ email: req.body.email })
      if (!user) return Response.UnauthorizedError(res, signinError)
      const passwordsMatch = await Helper.verifyPassword(
        req.body.password,
        user.password
      )
      if (!passwordsMatch) return Response.UnauthorizedError(res, signinError)
      const token = Helper.generateToken(user._id, user.firstName)
      Helper.setCookie(res, token)
      user.password = undefined
      const data = { token, user }
      return Response.Success(res, data)
    } catch (err) {
      return Response.InternalServerError(res, 'Error Logging in User')
    }
  }

  static async facebookLogin (req, res) {
    try {
      const { token } = req.body
      const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
          fields: ['id', 'email', 'first_name', 'last_name'].join(','),
          access_token: token
        }
      })
      if (data) {
        const response = {
          email: data.email,
          fullName: `${data.first_name} ${data.last_name}`,
          isActivated: true,
          facebookUserId: data.id
        }

        let myUser = await AuthServices.checkEmailExistence(data.email, res)

        // if the user does not have an account
        if (!myUser) {
          myUser = await Auth.create({ ...response })
        }

        const userToken = await Helper.generateToken(
          myUser._id,
          myUser.fullName
        )

        return Response.Success(res, { user: myUser, token: userToken }, 201)
      }
      return res.status(200).json({
        status: 'success',
        data
      })
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error logging in user through facebook'
      })
    }
  }

  static async verifyEmail (req, res) {
    try {
      const { email, tkn: code } = req.query
      const user = await Users.findOne({ email })
      if (user.emailVerified) {
        return Response.Success(res, {
          message: 'Your email has already been verified'
        })
      }
      const verification = await EmailVerification.findOne({ email, code })

      if (!verification) {
        Response.BadRequestError(
          res,
          'Sorry could not verify email. Request for a new verification'
        )
      } else {
        user.emailVerified = true
        await user.save()

        Response.Success(res, {
          message: 'Congratulations! Email verified successfully'
        })
      }
    } catch (err) {
      return Response.InternalServerError(res, 'Error verifying email')
    }
  }
}
