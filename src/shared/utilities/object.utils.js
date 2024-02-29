/**
 * Object Utilities
 */
export default class ObjectUtils {

    /**
     * Creates an object composed of the picked object properties.
     *
     * @param {Object} object
     * @param {string[]} keys
     * @returns {Object}
     */
    static pick = (object, keys) => {
        return keys.reduce((slag, key) => {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                slag[key] = object[key];
            }

            return slag;
        }, {});
    };
}
