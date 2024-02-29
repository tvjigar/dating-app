import express from 'express';
import { ValidationMiddlewares } from '../../core/validation/index.js';
import AuthController from './auth.controller.js';
import AuthValidations from './auth.validations.js';
import multer from 'multer';

const AuthRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Method: POST
 * Path: /api/auth/register
 */
AuthRouter.post(
    '/register',
    upload.fields([{ name: "profile_photo", maxCount: 4 }]),
    ValidationMiddlewares.createRequestDataValidator(AuthValidations.register),
    AuthController.register
);

/**
 * Method: POST
 * Path: /api/auth/login
 */
AuthRouter.post(
    '/login',
    ValidationMiddlewares.createRequestDataValidator(AuthValidations.login),
    AuthController.login
);

/**
 * Method: POST
 * Path: /api/auth/send-otp
 */
AuthRouter.post(    
    '/send-otp',
    ValidationMiddlewares.createRequestDataValidator(AuthValidations.sendOtp),
    AuthController.sendOtp
);

/**
 * Method: POST
 * Path: /api/auth/verify-otp
 */
AuthRouter.post(    
    '/verify-otp',
    ValidationMiddlewares.createRequestDataValidator(AuthValidations.verifyOtp),
    AuthController.verifyOtp
);

/**
 * Method: POST
 * Path: /api/auth/logout
 */
AuthRouter.post(
    '/logout',
    ValidationMiddlewares.createRequestDataValidator(AuthValidations.logout),
    AuthController.logout
);

export default AuthRouter;
