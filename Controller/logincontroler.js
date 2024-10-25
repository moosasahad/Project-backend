const user = require("../Models/userschema")
const {JoiUserSchema} = require("../Models/validation")
const bcrypt = require("bcrypt")
const customEroror = require("../utils/customError")


const userRg = async (req, res, next) => {
   const {value,error} = JoiUserSchema.validate(req.body)
   const {name,email,number,password,confirmpassword,} =value
   
   if(error) {
    return next(new customEroror(error.details[0].message,400))
   }

   if(password !== confirmpassword) {
    return next(new customEroror('Passwords do not match', 400))
   }
   const hashedpassword = await bcrypt.hash(password, 6)
   const newuser = new user({name,password:hashedpassword,confirmpassword:hashedpassword,number,email})
   await newuser.save()
   res.status(200).json({stattus:"succes",massage:"Registerd succesfully",data:newuser})
    
}

//user login----

const userlogin = async (req,res,next)=>{
    const {value,error} = JoiUserSchema.validate(req.body);
    if(error){
        return next(new CustomError('Validation error: ' + error.details[0].message, 400));
    }

const {name,password} = value;

}





module.exports = {
    userRg,
}