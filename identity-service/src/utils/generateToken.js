const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const refreshtoken = require('../models/RefreshToken');
const generateToken = async (user)=>{
    const authtoken = await jwt.sign({id:user._id,name:user.name},process.env.JWT_SECRET,{expiresIn:'1h'});
    const refreshtokenVal = await crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000*60*60*24*30);
    const refreshtokenmodel = new refreshtoken({
        token:refreshtokenVal,
        user:user._id,
        expiresAt   
    })
    await refreshtokenmodel.save();
    return {authtoken,refreshtokenVal};


}
module.exports = generateToken;