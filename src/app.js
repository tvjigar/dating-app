import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import { UserRouter } from './features/user/index.js';
import { AuthRouter, PassportJwtStrategy } from './features/auth/index.js';
import { ErrorController } from './core/error/index.js';
import Middlewares from './core/middleware/middleware.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

const router = express.Router();

const routes = [
    {
        path: '/auth',
        router: AuthRouter,
    },
    {
        path: '/user',
        router: UserRouter,
    }
];

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(
    express.urlencoded({
        extended: true,
        limit: "15mb",
    }),
);

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(
    cors({
        origin: true,
        credentials: true,
        'Access-Control-Allow-Origin': true,
        'Access-Control-Allow-Headers': true,
        'Access-Control-Expose-Headers': true,
        'Access-Control-Allow-Credentials': true,
    }),
);

// enable pre-flight
app.options('*', cors());

// enable passport
app.use(passport.initialize());
app.use("/uploads", express.static(`${__dirname}/uploads`));

// configure passport
passport.use(
    PassportJwtStrategy.name,
    PassportJwtStrategy.strategy
);

// add locals to the req var
app.use((req, res, next) => {
    if (!req.locals) {
        req.locals = {};
    }
    next();
});

// configure router
routes.forEach((route) => {
    router.use(route.path, route.router);
});

// attach router
app.use('/api', router);

// attach not found controller
// app.use(ErrorController.notFound);

// attach error converter
app.use(Middlewares.errorMiddlewares);

export default app;
