import path from 'path';
import dotenv from 'dotenv';

const currentModuleUrl = new URL(import.meta.url);
const currentModuleDir = path.dirname(currentModuleUrl.pathname);

const envPath = path.join(currentModuleDir, '../.env');

dotenv.config({
    path: envPath,
});

const config = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    envs: {
        isDev: process.env.NODE_ENV === 'development',
        isProd: process.env.NODE_ENV === 'production',
    },
    mongo: {
        url: process.env.MONGO_URL,
        options: {},
    },
    jwt: {
        algorithm_code: process.env.GOOGLE_AUTH_ALGORITHMS,
        google_auth_password: process.env.GOOGLE_AUTH_PASSWORD,
        AUTH: {
            secret: process.env.JWT_AUTH_SECRET,
            expiration: process.env.JWT_AUTH_EXPIRATION,
            expirationUnit: process.env.JWT_AUTH_EXPIRATION_UNIT || 'minutes',
        },
        REFRESH: {
            secret: process.env.JWT_REFRESH_SECRET,
            expiration: process.env.JWT_REFRESH_EXPIRATION,
            expirationUnit: process.env.JWT_REFRESH_EXPIRATION_UNIT || 'days',
        },
    },
    email: {
        from: process.env.EMAIL_FROM,
        smtp: {
            host: process.env.EMAIL_SMTP_HOST,
            port: process.env.EMAIL_SMTP_PORT,
            auth: {
                user: process.env.EMAIL_SMTP_USERNAME,
                pass: process.env.EMAIL_SMTP_PASSWORD,
            },
        },
    },
    app: {
        link: process.env.APP_LINK,
    },
};

export default config;
