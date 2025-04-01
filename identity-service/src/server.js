require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/identity_service')
const cors = require('cors');
const helmet = require('helmet');   
const logger = require('./utils/Logger');
const errorhandler = require('./middlewares/errorHandler');
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
    logger.info(`${req.method} ${req.url}`);
    next();
})
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