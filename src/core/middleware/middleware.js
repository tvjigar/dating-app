import passport from 'passport';
import { ApiError, ErrorExceptions } from '../error/index.js';
import PassportJwtStrategy from '../../features/auth/configs/passport-jwt-startegy.config.js';
import { UserService } from '../../features/user/index.js';
import { AsyncUtils } from "../../shared/utilities/index.js";

/**
 * Authentication Middlewares
 */
export default class Middlewares {

    /**
     * Creates an express middleware function.
     *
     * It uses "passport.authenticate" to verify the JWT token from the authorization header with bearer schema.
     *
     * @returns {function}
     */
    static createAuthGuard = () => {
        return passport.authenticate(
            PassportJwtStrategy.name,
            { session: false },
            undefined,
        );
    };
    /**
     * Creates an express middleware function.
     *
     * It uses "passport.authenticate" to verify the JWT token from the authorization header with bearer schema.
     *
     * @returns {function}
     */
    static createMountUserFromToken = () =>
    AsyncUtils.asyncHandler(async (req, res, next) => {
      const userDoc = await UserService.getUserById(req.user.id);
      if (!userDoc) {
        throw ErrorExceptions.UNAUTHORIZED();
      }

      req.locals.user = userDoc;

      next();
    });


    static errorMiddlewares = (error, req, res, next) => {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
            } else {           
            res.status(500).json({
                message: 'Internal Server Error',
                statusCode: 500,
            });
        }
    };
   
}
