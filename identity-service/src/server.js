require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./utils/Logger');
const app = express();
app.use(cors());
app.use(express.json());
console.log(process.env.MONGO_URI);app.listen(process.env.PORT,()=>{
    logger.info(`Server is running on port ${process.env.PORT}`);   
mongoose.connect(process.env.MONGO_URI).then(()=>{
    logger.info('Connected to MongoDB');
}).catch((err)=>{
    logger.error(err);
})
})