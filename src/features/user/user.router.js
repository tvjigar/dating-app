import express from 'express';
import { ValidationMiddlewares } from '../../core/validation/index.js';
import { Middlewares } from '../../core/middleware/index.js';
import UserController from './user.controller.js';
import UserValidations from './user.validations.js';
import multer from "multer";

const UserRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Method: GET
 * Path: /api/user/
 */
UserRouter.get(
    '/',
    Middlewares.createAuthGuard(),
    Middlewares.createMountUserFromToken(),
    UserController.getUsers
);


/**
 * Method: GET
 * Path: /api/user/:userId
 */
UserRouter.get(
    '/:userId',
    Middlewares.createAuthGuard(),
    Middlewares.createMountUserFromToken(),
    ValidationMiddlewares.createRequestDataValidator(UserValidations.getUser),
    UserController.getUser
);

/**
 * Method: PATCH
 * Path: /api/user/:userId
 */
UserRouter.patch(
    '/:userId',
    Middlewares.createAuthGuard(),
    Middlewares.createMountUserFromToken(),
    upload.fields([{ name: "profile_photo", maxCount: 4 }]),
    ValidationMiddlewares.createRequestDataValidator(UserValidations.updateUser),
    UserController.updateUser
);

/**
 * Method: DELETE
 * Path: /api/user/:userId
 */
UserRouter.delete(
    '/:userId',
    Middlewares.createAuthGuard(),
    Middlewares.createMountUserFromToken(),
    ValidationMiddlewares.createRequestDataValidator(UserValidations.deleteUser),
    UserController.deleteUser
);

export default UserRouter;
