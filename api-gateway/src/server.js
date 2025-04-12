require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const helmet = require('helmet');
const Redis = require('ioredis');
const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const proxy = require('express-http-proxy');

const logger = require('./utils/Logger');
const errorhandler = require('./middleware/errorHandler');
const CustomError = require('./utils/customError');

const app = express();
const redisClient = new Redis(process.env.REDIS_URI);

// Middleware for security and parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiter configuration
const ratelimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
});
app.use(ratelimiter);

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

// Proxy options
const proxyOptions = {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/, "/api");
    },
    proxyErrorHandler: (err, res, next) => {
        next(new CustomError('Service unavailable', 503));
    }
};

// Proxy middleware for identity service
app.use('/v1/auth', proxy(process.env.IDENTITY_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts) => {
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        return proxyReqOpts;
    },
    userResDecorator: async (proxyRes, proxyResData) => {
        logger.info(`Response received from Identity Service: ${proxyRes.statusCode}`);
        return proxyResData;
    }
}));

// Error handling middleware
app.use(errorhandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
