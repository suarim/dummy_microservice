const jwt = require('jsonwebtoken');
const generateToken = async (user)=>{
    const token = await jwt.sign({id:user._id,name:user.name},process.env.JWT_SECRET,{expiresIn:'1h'});
    return token;
}
module.exports = generateToken;