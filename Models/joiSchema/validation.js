
const joi =require('joi')


const JoiUserSchema = joi.object({
    name: joi.string(),
    number: joi.number().min(10).required(),
    email: joi.string().email().required(),
    password:joi.string().min(6).required(),
    confirmpassword: joi.string().min(6),
})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password:joi.string().min(6).required()
})
module.exports = {JoiUserSchema,loginSchema}