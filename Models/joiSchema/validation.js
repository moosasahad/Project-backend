
const joi =require('joi')


const JoiUserSchema = joi.object({
    name: joi.string().required(), 
    emaile: joi.string().email(),
    number: joi.number().min(10),
    email: joi.string().email(),
    password:joi.string().min(6).required(),
    confirmpassword: joi.string().min(6),
    admin:joi.boolean().optional(),
    status:joi.boolean().optional()
})

module.exports = {JoiUserSchema}