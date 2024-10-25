const user = require("../Models/userschema")
const {JoiUserSchema} = require("../Models/validation")
const bcrypt = require("bcrypt")
const CustomError = require("../utils/customError")


const userRg = async (req, res, next) => {
   const {value,error} = JoiUserSchema.validate(req.body)
   const {name,email,number,password,confirmpassword,} =value
   
   if(error) {
    return next(new CustomError(error.details[0].message,400))
   }

   if(password !== confirmpassword) {
    return next(new CustomError('Passwords do not match', 400))
   }
   const hashedpassword = await bcrypt.hash(password, 6)
   const newuser = new user({name,password:hashedpassword,confirmpassword:hashedpassword,number,email})
   await newuser.save()
   res.status(200).json({stattus:"success",massage:"Registerd succesfully",data:newuser})
    
}

//user login----

const userlogin = async (req,res,next)=>{
    const {value,error} = JoiUserSchema.validate(req.body);
    if(error){
        return next(new CustomError('Validation error: ' + error.details[0].message, 400));
    }

const {name,password} = value;


// user login and jwt token

const loginuser = await user.findOne({name})
console.log(loginuser);
console.log("name",name);



if(!loginuser){
    return next(new CustomError("loginuser not found",404))
}
const password_match = await bcrypt.compare(password,loginuser.password)
if(!password_match){
    return next(new CustomError('password is wrong', 404));
}
res.status(200).json({ status: 'success', message: "Logged in successfully"});
}

const userlogout = async (req,res,next)=>{
    res.status(200).json({messsage:"logout successful"})
}





module.exports = {
    userRg,
    userlogin,
    userlogout,
}