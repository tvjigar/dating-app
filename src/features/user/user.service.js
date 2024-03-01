import UserModel from "../model/user.model.js";
import { Exceptions } from "../../core/exceptions/index.js";
import OtpModel from "../model/otp.model.js";

/**
 * User Service
 */
export default class UserService {
  /**
   * Get all users.
   *
   * @returns {Promise<UserModel[]>}
   */
  static getUsers = async () => {
    return await UserModel.find()
      .populate("gender_id")
      .populate("interested_in_see")
      .populate("relation_looking_for")
      .populate({
        path: "interests.interest_id",
        model: "Interest",
      })
      .populate({
        path: "interests.interest_details_id",
        model: "InterestDetail",
      })
      .exec();
  };

  /**
   * Get user by id.
   *
   * @param {ObjectId} id
   *
   * @returns {Promise<UserModel>}
   */
  static getUserById = async (id) => {
    // return UserModel.findById(id).exec();
    return await UserModel.findById(id)
      .populate("gender_id")
      .populate("interested_in_see")
      .populate("relation_looking_for")
      .populate({
        path: "interests.interest_id",
        model: "Interest",
      })
      .populate({
        path: "interests.interest_details_id",
        model: "InterestDetail",
      })
      .exec();
  };

  /**
   * Get user by email.
   *
   * @param {string} email
   *
   * @returns {Promise<UserModel>}
   */
  static getUserByEmail = async (email) => {
    return UserModel.findOne({ email }).exec();
  };

  /**
   * Get user by phone number.
   *
   * @param {string} phone_number
   *
   * @returns {Promise<UserModel>}
   */
  static getUserByNumber = async (phone_number) => {
    return UserModel.findOne({ phone_number }).exec();
  };

  /**
   * Create a new user.
   *
   * @param {Object} data
   * @param {string} data.email
   * @param {string} data.password
   *
   * @returns {Promise<UserModel>}
   *
   * @throws {ApiError} - EMAIL_TAKEN
   */
  static createUser = async (data) => {
    const isEmailTaken = await UserModel.isEmailTaken(data.email);
    // const isPhoneNoTaken = await UserModel.isPhoneNoTaken(data.phone_number);

    // if (isPhoneNoTaken) {
    //     throw Exceptions.PHONE_NUMBER_TAKEN();
    // }

    if (isEmailTaken) {
      throw Exceptions.EMAIL_TAKEN();
    }

    return UserModel.create(data);
  };

  /**
   * Update the user with the given id.
   *
   * @param {ObjectId} userId
   * @param {Object} userData
   *
   * @returns {Promise<UserModel>}
   */
  static updateUserById = async (userId, userData) => {
    const user = await UserService.getUserById(userId);

    if (!user) {
      throw Exceptions.USER_NOT_FOUND();
    }

    const updateUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      userData,
      { new: true }
    );

    return updateUser;
  };

  /**
   * Deletes the user with the given id.
   *
   * @param {ObjectId} userId
   *
   * @returns {Promise<UserModel>}
   */
  static deleteUserById = async (userId) => {
    const user = await UserService.getUserById(userId);

    if (!user) {
      throw Exceptions.USER_NOT_FOUND();
    }

    // await user.remove();
    const updateUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { is_deleted: new Date()}
    );
    return updateUser;
  };

  /**
   * Find otp.
   *
   * @param {string} phone_number
   *
   * @returns {Promise<UserModel>}
   */
  static findOtp = async (phone_number) => {
    return OtpModel.findOne({ phone_number });
  };

  /**
   * Delete otp by number.
   *
   * @param {string} phone_number
   *
   * @returns {Promise<UserModel>}
   */
  static deleteOtpByNumber = async (phone_number) => {
    return OtpModel.deleteOne({ phone_number });
  };

  /**
   * Create otp.
   *
   * @param {string} phone_number
   *
   * @returns {Promise<UserModel>}
   */
  static createOtp = async (data) => {
    return OtpModel.create(data);
  };

  /**
   * Create otp.
   *
   * @param {string} phone_number
   *
   * @returns {Promise<UserModel>}
   */
  static verifyOtp = async (data) => {
    return await OtpModel.findOne({
      $and: [
        { phone_number: data.phone_number },
        { otp: data.otp },
        { created_at: { $gt: new Date(data.tenMinutesOld).getTime() } },
      ],
    })
  };
}
