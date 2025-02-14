// validators/userValidator.js
const Joi = require('joi');

const registerSchema = Joi.object({
    first_name: Joi.string().max(35).regex(/^[a-zA-Z].*/).required(),
    last_name: Joi.string().max(35).regex(/^[a-zA-Z].*/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')).required()
});

module.exports = { registerSchema };