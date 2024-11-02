const { JoiProductSchema } = require("../../Models/joiSchema/joiproduct")
const product = require("../../Models/Schema/ProductSchema")



const addproduct = async (req,res)=>{
    const {value,error} = JoiProductSchema.validate(req.body)

    if(error){
        return res.status(400).json({ massage: "joi validation_error"});
    }
    
    const {name,type,price,offerprice,qty,description,brand,rating,reviews} = value;
    const image = req.file?.path


    const newuser = new product({
        name,type,image,price,offerprice,qty,description,brand,rating,reviews
    })
   await newuser.save()
    res.json({massage:"product added",newuser})
}
const editproduct = async (req,res,next)=>{
    const {}

}

module.exports={
    addproduct,
}
