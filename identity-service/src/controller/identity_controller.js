const usermodel = require('../models/User');
const refreshtokenmodel = require('../models/RefreshToken');
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

const refreshtokenController = async (req,res)=>{
    try{
    const {refreshtoken} = req.body;
    // logger.info(`Refresh token request for ${refreshtoken}`);
    if(!refreshtoken){
        throw new CustomError('Please enter all fields',400);
        
    }
    const refresh_token = await refreshtokenmodel.findOne({token:refreshtoken});
    
 
    if(!refresh_token || refresh_token?.expiresAt < Date.now()){
        throw new CustomError('Invalid refresh token',401);
       
    }
    const user = await usermodel.findById(refresh_token.user);
    if (!user){
        throw new CustomError('User not found',404);
       
    }    
    await refresh_token.deleteOne()
    const {authtoken,refreshtokenVal} = await generateToken(user);
    res.status(200).json({status:'success',data:{authtoken,refreshtoken:refreshtokenVal}});
    logger.info(`Refresh token generated for user ${user.email}`);
}
catch(err){
    return res.status(err.status || 500).json({status:'fail',message:err.message});

}
}

const logoutController = async (req,res)=>{
    try{
    const {refreshtoken} = req.body;
    if(!refreshtoken){
        throw new CustomError('Please enter all fields',400);
    }
    const refresh_token = await refreshtokenmodel.findOne({token:refreshtoken});
    if(!refresh_token || refresh_token?.expiresAt < Date.now()){
        throw new CustomError('Invalid refresh token',401);
    }
    await refresh_token.deleteOne();
    res.status(200).json({status:'success',message:'Logged out successfully'});
}
    catch(err){
        return res.status(err.status || 500).json({status:'fail',message:err.message});
    }
}

module.exports = {userregistercontroller,getallusers,refreshtokenController,logoutController};
