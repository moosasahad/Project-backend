const user = require("../Models/userschema")
const {JoiUserSchema} = require("../Models/validation")



// const userRg = async (req,res,next)=>{
//     const {value ,error} = JoiUserSchema.validate(req.body)
//     console.log(value);
//     res.send("sended")
    
// }
const userRg = async (req, res, next) => {
    try {
        const { value, error } = JoiUserSchema.validate(req.body)
    const { name,number, password, confirmpassword, email } = value
    console.log(value);
    

    if (error) {
        // return next(new CustomError(error.details[0].message, 400))
        return error
    }



    // const hashedpassword = await bcrypt.hash(password, 8)
    const newUser = new user({ name,number, password, confirmpassword, email })
    await newUser.save()
    res.status(200).json({ status: 'succes', message: 'Registerd succesfully', data: newUser })

    } catch (error) {
        console.log(error)
    }
    
}

module.exports = {
    userRg
}