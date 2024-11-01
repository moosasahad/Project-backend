const user = require("../Models/Schema/userschema");
const joischema = require("../Models/joiSchema/validation");
const bcrypt = require("bcrypt");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

const userRg = async (req, res, next) => {
  const { value, error } = joischema.JoiUserSchema.validate(req.body);
  const { name, email, number, password, confirmpassword } = value;

  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }

  if (password !== confirmpassword) {
    return next(new CustomError("Passwords do not match", 400));
  }
  const hashedpassword = await bcrypt.hash(password, 6);
  const newuser = new user({
    name,
    password: hashedpassword,
    number,
    email,
  });
  await newuser.save();
  res.status(200).json({
    stattus: "success",
    massage: "Registerd succesfully",
    data: newuser,
  });
};

//user login----

const userlogin = async (req, res, next) => {
  const { value, error } = joischema.loginSchema.validate(req.body);
  if (error) {
    return next(
      new CustomError("Validation error: " + error.details[0].message, 400)
    );
  }

  const { email, password } = value;

  // admin login

  const admin = await user.findOne({adminemail:email})
  
    if(admin){ 
      console.log("admin logined");
      const token = jwt.sign({
        id:admin._id,admin:true},process.env.JWT_TOKEN,{expiresIn:'1m'}
      );
      const refreshToken = jwt.sign(
        {id:admin._id, admin:true},process.env.JWT_TOKEN,{expiresIn:'1d'}
      );
      res.cookie("token",token,{
            httpOnly: true,     
            secure: false, 
            sameSite: "none", 
            maxAge: 30 * 60 * 1000 
      })
      res.cookie("refreshToken",refreshToken, {
        httpOnly: true, 
            secure: false, 
            sameSite: "none", 
            maxAge: 1 * 24 * 60 * 60 * 1000 
      })
       res.status(200).json({ admin: true, message:"admin logined" });
       res.end()
    }else{
       // user login and jwt token

  const loginuser = await user.findOne({email:email});

  if (!loginuser) {
    return next(new CustomError("loginuser not found", 404));
  }
  const password_match = await bcrypt.compare(password, loginuser.password);
  if (!password_match) {
    return next(new CustomError("password is wrong", 404));
  }


  
  let token = jwt.sign(
    { id: loginuser._id, name: loginuser.name, email: loginuser.email },
    process.env.JWT_TOKEN,
    { expiresIn: "1m" }
  );
  const refreshToken = jwt.sign(
    { id: loginuser._id, name: loginuser.name, email: loginuser.email },
    process.env.JWT_TOKEN,
    { expiresIn: "7d" }
  );
  console.log("tokendnd", token);
  console.log("user logined");
  

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 1 * 60 * 1000,
    sameSite: "lax",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });
  res.status(200).json({ status: "success", message: "user Logged in successfully" });
    }

 
};

// logout................

const userlogout = async (req, res, next) => {
    try {
        res.clearCookie("token","refreshToken",{
            httpOnly:true,
            secure:true,
            sameSite:"none"    
        })
        
        console.log("logouted")
        res.status(200).json({status:"success",message:"logout successfully"})
    } catch (error) {
        res.status(404).send("logout failed",error)
        
    }
};

// get user in admin side

const getallusersinadmin = async (req,res,next)=>{

  const alluser = await user.find({ admin: { $ne: true } })
  res.json({message:"getd all user",alluser})

}

const getspscificser = async (req,res,next) =>{
  const {id} = req.params.id;
  const spcificuser = await user.findOne({id})
  res.json({message:"getd spacific user",spcificuser})

}
 
module.exports = {
  userRg,
  userlogin,
  userlogout,
  getallusersinadmin,
  getspscificser,
};
