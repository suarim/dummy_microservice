require('dotenv').config();
const express = require('express'); 
const logger = require('./utils/Logger');
const errorhandler = require('./middleware/errorHandler');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use((req,res,next)=>{
    console.log('Request received');
    logger.info(`${req.method} ${req.url}`);
    next();
})
app.listen(process.env.PORT || 3000, () => {
    logger.info(`Server is running on port ${process.env.PORT || 3000}`);
})