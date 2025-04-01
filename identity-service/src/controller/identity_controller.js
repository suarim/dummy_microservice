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
const getallusers = async (req,res,next)=>{
    try{
        const {page,offset} = req.body;
        const users = await usermodel.find({}, '-password').limit(parseInt(offset)).skip(parseInt(page));
        if(users.length === 0){
            throw new CustomError('No users found',404);
        }
        res.status(200).json({status:'success',data:users});
    }
    catch(err){
        next(err)
    }
}
module.exports = {userregistercontroller,getallusers};
