/**
 * Token Enums
 */
export default class TokenEnums {

    /**
     * Available token types - map
     *
     * @type {{
     * AUTH: "AUTH",
     * REFRESH: "REFRESH"
     * }}
     */
    static TOKENS = {
        AUTH: 'AUTH',
        REFRESH: 'REFRESH'
    };

    /**
     * Available token types - array
     *
     * @type {[
     * "AUTH",
     * "REFRESH"
     * ]}
     */
    static TOKENS_ARRAY = Object.values(
        TokenEnums.TOKENS
    );
}
