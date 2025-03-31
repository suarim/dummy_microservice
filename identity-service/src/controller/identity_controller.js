const usermodel = require('../models/User');
const argon2 = require('argon2');
const logger = require('../utils/Logger');
const jwt = require('jsonwebtoken');
const userregistercontroller = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        const hashedPassword = await argon2.hash(password);
        const user = new usermodel({
            name,email,hashedPassword
        })
        await user.save();
        logger.info(`User registered with email ${email}`);
        res.status(201).json({status:'success',message:'User registered successfully'});
    }
    catch(err){
        logger.error(err);
        res.status(500).json({status:'error',message:'Internal server error'});
    }
}

