const usermodel = require('../models/User');
const argon2 = require('argon2');
const logger = require('../utils/Logger');
const validateschema = require('../utils/validation');
const generateToken = require('../utils/generateToken');
const CustomError = require('../utils/customError');
const userregistercontroller = async (req,res,next)=>{
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            throw new CustomError('Please enter all fields',400);
        }
        const hashedPassword = await argon2.hash(password);
        const {error} = validateschema(req.body);
        if (error){
            logger.error(error);
            throw new CustomError(error.details[0].message,400);
        }
        else{
        const user = new usermodel({
            name,email,password:hashedPassword
        })
        await user.save();
        const {authtoken,refreshtokenVal} = await generateToken(user);
        logger.info(`User registered with email ${email}`);
        res.status(201).json({status:'success',data:{name,email,authtoken,refreshtoken:refreshtokenVal}});
    }
    }
    catch(err){
        next(err)
    }
}
module.exports = userregistercontroller;
