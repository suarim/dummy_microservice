require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/identity_service')
const cors = require('cors');
const helmet = require('helmet');   
const logger = require('./utils/Logger');
const errorhandler = require('./middlewares/errorHandler');
const {RateLimiterRedis} = require('rate-limiter-flexible')
const Redis = require('ioredis');
const {rateLimit} = require('express-rate-limit')
const {RedisStore} = require('rate-limit-redis');
const CustomError = require('./utils/customError');

const app = express();
const redis = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
    logger.info(`${req.method} ${req.url}`);
    next();
})
const ratelimiter = new RateLimiterRedis({
    storeClient:redis,
    keyPrefix:'middleware',
    points:1000000,
    duration:2,
}) 

app.use((req,res,next)=>{
    ratelimiter.consume(req.ip)
    .then(()=>{
        next();
    })
    .catch((err)=>{
         next(new CustomError('Too many requests',429));
        
    })
})

const sensitivelimiter = rateLimit({
    windowMs:15*60*1000,
    max:100000000,
    standardHeaders: true,
    legacyHeaders:false,
    handler: (req,res)=>{
        throw new CustomError('Too many requests123',429);
    },
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    })
})
app.use('/api/auth/users',sensitivelimiter);
app.use('/api/auth',routes);
app.use(errorhandler);

console.log(process.env.MONGO_URI);app.listen(process.env.PORT,()=>{
    logger.info(`Server is running on port ${process.env.PORT}`);   
    logger.info(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI).then(()=>{
    logger.info('Connected to MongoDB');
}).catch((err)=>{
    logger.error(err);
})
})