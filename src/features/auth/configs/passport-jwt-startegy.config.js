import PassportJwt from 'passport-jwt';
import passport from 'passport';
import config from '../../../config.js';
import GoogleStrategy from 'passport-google-oauth20';

// Apple Login Strategy
// passport.use(new AppleStrategy(appleAuthConfig, (accessToken, refreshToken, profile, done) => {
//     // Handle Apple authentication logic, e.g., create or find user in the database
//     // You may also want to store user data in the session or JWT payload
//     return done(null, profile);
// }));
  
// // Google Login Strategy
// passport.use(new GoogleStrategy(googleAuthConfig, (accessToken, refreshToken, profile, done) => {
//     // Handle Google authentication logic, e.g., create or find user in the database
//     // You may also want to store user data in the session or JWT payload
//     return done(null, profile);
// }));

/**
 * Passport JWT Strategy
 */
export default class PassportJwtStrategy {

    /**
     * Passport JWT Strategy name
     */
    static name = 'jwt';

    /**
     * Passport JWT Strategy options
     */
    static options = {
        secretOrKey: config.jwt.AUTH.secret,
        jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    };

    /**
     * Passport JWT Strategy verifier
     */
    static verifier = async (payload, done) => {
        /*
            Don't query for the user in the database here. There will be a middleware that will do just that.
            There may be cases when you don't really want to see if the user exists, only validate it's token.
         */
        done(null, { ...payload, id: payload.sub });
    };

    /**
     * Passport JWT Strategy Instance
     */
    static strategy = new PassportJwt.Strategy(
        PassportJwtStrategy.options,
        PassportJwtStrategy.verifier
    );

    // setup for the google strategy
    // static googleStrategy = passport.use(
    //     new GoogleStrategy(
    //         {
    //             // options for the google strategy
    //             clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    //             clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    //             callbackURL: `http://localhost:4001/api/api/auth/google/redirect`,
    //         },
    //         (accessToken, refreshToken, profile, done) => {
    //             User.findOne({ googleID: profile.id }).then((foundUser) => {
    //                 if (!foundUser) {
    //                     User.create({
    //                         name: profile.displayName,
    //                         isAdmin: false,
    //                         isConfirmed: profile._json.email_verified,
    //                         googleID: profile.id,
    //                         email: profile._json.email,
    //                         avatar: generateGravatar(profile._json.email), // gravatar is unique for all email IDs
    //                     })
    //                         .then((user) => {
    //                             done(null, user);
    //                         })
    //                         .catch((err) => {
    //                             // In case the User couldn't be created, this means that the email key was duplicate
    //                             // Which implies that the current email has already been registered using some different social account
    //                             // So throw the corresponding flash message
    //                             handleAuthError(err, done);
    //                         });
    //                 } else {
    //                     done(null, foundUser);
    //                 }
    //             });
    //         }
    //     )
    // );
}
