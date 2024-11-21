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
  const existinguser = await user.findOne({email})
  if(existinguser){
    return res.status(400).json({message:"email is already used"})
  }
  console.log("email",existinguser) 

  if (password !== confirmpassword) {
    return res.json(new CustomError("Passwords do not match", 400));
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
  const admin = await user.findOne({ adminemail: email });

  if (admin) {
    const admintoken = jwt.sign(
      { id: admin._id, admin: true },
      process.env.ADMIN_JWT_TOKEN,
      { expiresIn: "1d" }
    );
    const adminrefreshToken = jwt.sign(
      { id: admin._id, admin: true },
      process.env.ADMIN_JWT_TOKEN,
      { expiresIn: "2d" }
    );

    res.cookie("admintoken", admintoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie("adminrefreshToken", adminrefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.cookie("adminuser", admin, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    console.log("Admin logged in successfully.");
    res.status(200).json({ admin: true, message: "Admin logged in successfully." });
    return;
  }

  // user login and JWT token
  const loginuser = await user.findOne({ email: email });

  if (!loginuser) {
    return next(new CustomError("User not found", 404));
  }

  const password_match = await bcrypt.compare(password, loginuser.password);
  if (!password_match) {
    return next(new CustomError("Password is incorrect", 404));
  }

  if (loginuser.status === true) {
    return next(new CustomError("User is blocked", 404));
  }

  const token = jwt.sign(
    { id: loginuser._id, name: loginuser.name, email: loginuser.email },
    process.env.JWT_TOKEN,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: loginuser._id, name: loginuser.name, email: loginuser.email },
    process.env.JWT_TOKEN,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("users", JSON.stringify(loginuser), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });

  console.log("User logged in successfully.");
  res.status(200).json({
    status: "success",
    message: "User logged in successfully.",
    name: loginuser,
    token,
  });
};


// logout................

const userlogout = async (req, res, next) => {
        res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            sameSite:"lax"    
        })
        res.clearCookie("refreshToken",{
          httpOnly:true,
          secure:true,
          sameSite:"none"    
      })
      res.clearCookie("users",{
        httpOnly:true,
        secure:true,
        sameSite:"lax"    
    })
        
        console.log("user logouted")
        res.status(200).json({status:"success",message:"logout successfully"})
};

// admin logout .......

const adminlogout = async (req,res,next) => {
    res.clearCookie("admintoken",{
        httpOnly:true,
        secure:true,
        sameSite:"none"    
    })
    res.clearCookie("adminrefreshToken",{
      httpOnly:true,
      secure:true,
      sameSite:"none"    
  })
  res.clearCookie("adminuser",{
    httpOnly:true,
    secure:true,
    sameSite:"none"    
})
    
    console.log("logouted")
    res.status(200).json({status:"success",message:"admin logout successfully"})
}

const userblocking = async (req, res) => {
  console.log("reqid",req.body)
  try {
    const { userid } = req.body;
    if (!userid) {
      return res.status(400).send("User ID is required");
    }
    const users = await user.find({ _id: userid });

    if(!users){
      return res.status(400).send("User note found this id");
    }
    // const userstatus = users.find(item => item.status==false)
    // console.log("userstatus",userstatus);
    console.log("users.status==false",users.status==false) 
    const userse = users[0]
    if(userse.status==false){
      userse.status = true
      userse.save()
      res.json({massage:"user blocked"}) 
      
    }else{
      userse.status = false
      userse.save()
      res.json({massage:"user unblocked"})
    }


    console.log("user", userse.status);
    console.log("userid", userid);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
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
  adminlogout,
  getallusersinadmin,
  getspscificser,
  userblocking,
};
