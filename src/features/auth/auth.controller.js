import httpStatus from "http-status";
import { AsyncUtils } from "../../shared/utilities/index.js";
import { TokenService } from "../../core/token/index.js";
import { UserService } from "../../features/user/index.js";
import { Exceptions } from "../../core/exceptions/index.js";
import { uploadImage } from "../../core/multer/upload.js";
import jwt from "jsonwebtoken";
import config from "../../config.js";
import Common from "../../shared/common.js";

/**
 * Authentication Controller
 */
export default class AuthController {

  /**
   * Method: POST
   *
   * Path: /api/auth/register
   */
  static register = AsyncUtils.asyncHandler(async (req, res) => {
    let body = { ...req.body };

    const userExist = await UserService.getUserByEmail(body.email);
    if (req.files?.profile_photo && req.files?.profile_photo.length >= 1 && !userExist) {

      if(req.files?.profile_photo.length > 3){
        throw Exceptions.IMAGES_UPLOAD_NOT_VALID();
      }      
      let profile_photo = [];

      for (const photo of req.files?.profile_photo) {
        const profilePhotoResult = await uploadImage(
          photo,
          "profile_photo"
        );
        
        profile_photo.push(profilePhotoResult.folder_name)
      }
      
      body = { ...body, profile_photo: profile_photo };
    }

    const userDoc = await UserService.createUser(body);
    const authToken = await TokenService.generateAuthToken(userDoc);
    const refreshToken = await TokenService.generateRefreshToken(userDoc);

    res.status(httpStatus.CREATED).send({
      success: true,
      user: userDoc.toPlainObject(),
      tokens: {
        auth: authToken,
        refresh: refreshToken,
      },
    });
  });

  /**
   * Method: POST
   *
   * Path: /api/auth/login
   */
  static login = AsyncUtils.asyncHandler(async (req, res) => {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };
    let userDoc;
    if(req.body?.login_type == 'EMAIL'){
      userDoc = await UserService.getUserByEmail(data.email);

      if (!userDoc) {
        throw Exceptions.EMAIL_PASSWORD_WRONG();
      }
  
      const isPasswordMatch = await userDoc.isPasswordMatch(data.password);
  
      if (!isPasswordMatch) {
        throw Exceptions.EMAIL_PASSWORD_WRONG();
      }
  
      await TokenService.cleanupRefreshTokens(userDoc.id);
    } else if(req.body?.login_type == 'GOOGLE'){

      if(!req.body.token){
        throw Exceptions.TOKEN_NOT_PROVIDE();
      }
      const decodeEmail = jwt.decode(req.body.token, { algorithms: [config.jwt.algorithm_code] });

      const socialEmail = decodeEmail?.preferred_username || decodeEmail?.email;
      const firstName = decodeEmail?.name?.split(" ")[0] || decodeEmail?.given_name;
      const lastName = decodeEmail?.name?.split(" ")[1] || decodeEmail?.family_name;
      userDoc = await UserService.getUserByEmail(socialEmail);
  
      if (!userDoc) {
        userDoc = await UserService.createUser({
          email: socialEmail,
          name : firstName + lastName,
          password: config.jwt.google_auth_password,
          login_type: login_type,
          google_token: device_token,
        });
      }
    } else if(req.body?.login_type == 'APPLE'){}

    if (!userDoc) {
      throw Exceptions.USER_NOT_FOUND();
    }

    if (userDoc.is_deleted) {
      throw Exceptions.USER_HAS_DELETED();
    }

    const authToken = await TokenService.generateAuthToken(userDoc);
    const refreshToken = await TokenService.generateRefreshToken(userDoc);
    res.send({
      success: true,
      user: userDoc.toPlainObject(),
      tokens: {
        auth: authToken,
        refresh: refreshToken,
      },
    });
  });

  /**
   * Method: POST
   *
   * Path: /api/auth/send-otp
   */
   static sendOtp = AsyncUtils.asyncHandler(async (req, res) => {
    const userExist = await UserService.getUserByNumber(req.body.phone_number);
    if (userExist) {
        let OTP = Common.generateOTP();
        const otpData = await UserService.findOtp(req.body.phone_number);
        if (otpData) {
          const deleteOTP = await UserService.deleteOtpByNumber(req.body.phone_number);
          if (deleteOTP.deletedCount > 0) {
            await UserService.createOtp({
              phone_number: req.body.phone_number,
              otp: OTP,
              created_at: new Date(),
            });
            res.status(httpStatus.OK).send({
              success: true,
              message: "Otp send successfully!"
            });  
          }
        } else {
          await UserService.createOtp({
            phone_number: req.body.phone_number,
            otp: OTP,
            created_at: new Date(),
          });
          res.status(httpStatus.OK).send({
            success: true,
            message: "Otp send successfully!"
          });         
        }     
    } else {
      throw Exceptions.USER_NOT_FOUND();
    }
  });

  /**
   * Method: POST
   *
   * Path: /api/auth/verify-otp
   */
  static verifyOtp = AsyncUtils.asyncHandler(async (req, res) => {
    var tenMinutesOld = new Date();
    tenMinutesOld.setMinutes(tenMinutesOld.getMinutes() - 10);

    const otp = await UserService.verifyOtp({
      phone_number : req.body.phone_number,
      otp : req.body.otp,
      tenMinutesOld
    });
    if (otp?.otp === req.body.otp) {
      const user = await UserService.getUserByNumber(otp.phone_number)
      if (user) {
        await UserService.deleteOtpByNumber(user.phone_number);
        const authToken = await TokenService.generateAuthToken(user);
        const refreshToken = await TokenService.generateRefreshToken(user);
        res.status(httpStatus.OK).send({
          success: true,
          user: user.toPlainObject(),
          tokens: {
            auth: authToken,
            refresh: refreshToken,
          },
        });
      } else {
        throw Exceptions.OTP_NOT_VALID();
      }
    } else if (!otp) {
      throw Exceptions.OTP_EXPIRED();
    }
      
  });

  /**
   * Method: POST
   *
   * Path: /api/auth/logout
   */
  static logout = AsyncUtils.asyncHandler(async (req, res) => {
    const data = {
      token: req.body.token,
    };

    const refreshTokenDoc = await TokenService.verifyRefreshToken(data.token);

    await TokenService.cleanupRefreshTokens(refreshTokenDoc.user);

    res.status(httpStatus.OK).send({ success: true });
  });
}
