import Joi from "joi";
import { PasswordValidator } from "../../core/validation/index.js";
import { GENDER, LOGIN_TYPE } from "../../shared/enum.js";

/**
 * Authentication Validations
 */
export default class AuthValidations {
  /**
   * Validates POST requests to /api/auth/register
   */
  static register = {
    files: Joi.object().keys({
      profile_image: Joi.array().items(Joi.string()).min(1).max(3),
    }),
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(PasswordValidator.validateJoi),
      phone_number: Joi.string().required(),
      name: Joi.string().required(),
      birth_date: Joi.date().required(),
      desc: Joi.string().required(),
      gender_id: Joi.string().required(),
      interested_in_see: Joi.array().required(),
      age_range_candidates: Joi.string().required(),
      height: Joi.number(),
      current_occupation: Joi.array(),
      interests: Joi.array()
        .items(
          Joi.object({
            interest_id: Joi.string().required(),
            interest_details_id: Joi.string().required(),
          })
        )
        .default([])
        .optional(),
      relation_looking_for: Joi.array(),
      google_token: Joi.string(),
      apple_token: Joi.string(),
      login_type: Joi.string()
        .required()
        .valid(...Object.values(LOGIN_TYPE)),
    }),
  };

  /**
   * Validates POST requests to /api/auth/login
   */
  static login = {
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      login_type: Joi.string().required(),
      token: Joi.string().allow(null).allow(""),
    }),
  };

  /**
   * Validates POST requests to /api/auth/send-otp
   */
  static sendOtp = {
    body: Joi.object().keys({
      phone_number: Joi.string().required(),
    }),
  };

  /**
   * Validates POST requests to /api/auth/verify-otp
   */
  static verifyOtp = {
    body: Joi.object().keys({
      phone_number: Joi.string().required(),
      otp: Joi.string().required(),
    }),
  };

  /**
   * Validates POST requests to /api/auth/logout
   */
  static logout = {
    body: Joi.object().keys({
      token: Joi.string().required(),
    }),
  };
}
