const JOI = require('joi');
const logger = require('./Logger');
const validateschema = (data) => {
    const schema = JOI.object({
        name: JOI.string().required(),
        email: JOI.string().email().required(),
        password: JOI.string().min(6).required()
    })
    return schema.validate(data);
}
module.exports = validateschema;