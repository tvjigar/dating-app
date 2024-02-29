import httpStatus from "http-status";
import { AsyncUtils } from "../../shared/utilities/index.js";
import UserService from "./user.service.js";
import { Exceptions } from "../../core/exceptions/index.js";
import { uploadImage } from "../../core/multer/upload.js";

/**
 * User Controller
 */
export default class UserController {
  /**
   * Method: GET
   *
   * Path: /api/user/
   */
  static getUsers = AsyncUtils.asyncHandler(async (req, res) => {
    const userDocs = await UserService.getUsers();
    res.send({
      success:true,
      data: userDocs,
    });
  });


  /**
   * Method: GET
   *
   * Path: /api/user/:userId
   *
   * @throws {ApiError} - USER_NOT_FOUND
   */
  static getUser = AsyncUtils.asyncHandler(async (req, res) => {
    const userDoc = await UserService.getUserById(req.params.userId);

    if (!userDoc) {
      throw Exceptions.USER_NOT_FOUND();
    }
    res.send({
      success:true,
      data: userDoc.toPlainObject(),
    });
  });

  /**
   * Method: PATCH
   *
   * Path: /api/user/:userId
   */
  static updateUser = AsyncUtils.asyncHandler(async (req, res) => {
    let body = { ...req.body };

    if (req.files?.profile_photo && req.files?.profile_photo.length >= 1) {
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

    const userDoc = await UserService.updateUserById(
      req.params.userId,
      body
    );
    res.send({
      success:true,
      user: userDoc,
    });
  });

  /**
   * Method: DELETE
   *
   * Path: /api/user/:userId
   */
  static deleteUser = AsyncUtils.asyncHandler(async (req, res) => {
    await UserService.deleteUserById(req.params.userId);

    res.status(httpStatus.OK).send({ success:true});
  });
}
