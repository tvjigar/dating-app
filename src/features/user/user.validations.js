import Joi from 'joi';
import {
    ObjectIdValidator,
} from '../../core/validation/index.js';

/**
 * User Validations
 */
export default class UserValidations {

    /**
     * Validates GET requests to /api/user/:userId
     */
    static getUser = {
        params: Joi.object().keys({
            userId: Joi.string().required().custom(ObjectIdValidator.validateJoi),
        }),
    };

    /**
     * Validates PATCH requests to /api/user/:userId
     */
    static updateUser = {
        params: Joi.object().keys({
            userId: Joi.string().required().custom(ObjectIdValidator.validateJoi),
        }),
        files: Joi.object().keys({
            profile_image: Joi.array().items(Joi.string()).min(1).max(3),
        }),
        body: Joi.object().keys({
            email: Joi.string().email(),
            phone_number: Joi.string(),
            name: Joi.string(),
            birth_date: Joi.date(),
            desc: Joi.string(),
            gender_id: Joi.string(),
            interested_in_see: Joi.array(),
            age_range_candidates: Joi.string(),
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
            relation_looking_for: Joi.array()
        }),
    };

    /**
     * Validates DELETE requests to /api/user/:userId
     */
    static deleteUser = {
        params: Joi.object().keys({
            userId: Joi.string().required().custom(ObjectIdValidator.validateJoi),
        }),
    };
}
