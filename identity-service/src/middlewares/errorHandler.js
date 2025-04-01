const logger = require('../utils/Logger');
const errorhandler = (err,req,res,next)=>{
    logger.error(err.message);
    res.status(err.status || 500).json({status:'error',message:err.message || 'Internal server error'});
    next();
}
module.exports = errorhandler;