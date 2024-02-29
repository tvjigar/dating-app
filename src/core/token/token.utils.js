import config from '../../config.js';

/**
 * Token Utils
 */
export default class TokenUtils {

    /**
     * Returns the config object for the given token type.
     *
     * @param {string} type
     * @returns {{
     * secret: string,
     * expiration: number,
     * expirationUnit: string
     * }}
     */
    static getTokenConfig = (type) => {
        return config.jwt[type];
    };
}
