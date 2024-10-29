const user = require("../Models/Schema/userschema");
const { JoiUserSchema } = require("../Models/joiSchema/validation");
const bcrypt = require("bcrypt");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

const userRg = async (req, res, next) => {
  const { value, error } = JoiUserSchema.validate(req.body);
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
    confirmpassword: hashedpassword,
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
  const { value, error } = JoiUserSchema.validate(req.body);
  if (error) {
    return next(
      new CustomError("Validation error: " + error.details[0].message, 400)
    );
  }

  const { name, password } = value;

  // user login and jwt token

  const loginuser = await user.findOne({ name });
  console.log(loginuser);
  console.log("name", name);

  if (!loginuser) {
    return next(new CustomError("loginuser not found", 404));
  }
  const password_match = await bcrypt.compare(password, loginuser.password);
  if (!password_match) {
    return next(new CustomError("password is wrong", 404));
  }
  let token = jwt.sign(
    { id: loginuser._id, username: loginuser.username, email: loginuser.email },
    process.env.JWT_TOKEN,
    { expiresIn: "1m" }
  );
  const refreshToken = jwt.sign(
    { id: loginuser._id, username: loginuser.username, email: loginuser.email },
    process.env.JWT_TOKEN,
    { expiresIn: "7d" }
  );
  console.log("tokendnd", token);

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
  res.status(200).json({ status: "success", message: "Logged in successfully" });
};

// logout................

const userlogout = async (req, res, next) => {
    try {
        res.clearCookie("token","refreshToken",{
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })
        
        console.log("hello")
        res.status(200).json({status:"success",message:"logout successfully"})
    } catch (error) {
        res.status(404).send("logout failed",error)
        
    }
};

module.exports = {
  userRg,
  userlogin,
  userlogout,
};
