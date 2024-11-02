const { JoiProductSchema } = require("../../Models/joiSchema/joiproduct")
const product = require("../../Models/Schema/ProductSchema")
const CustomError = require("../../utils/customError")
const cart = require("../../Models/Schema/cartSchema")


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

// edite product

const editproduct = async (req,res,next)=>{
    const {value,error} =JoiProductSchema.validate(req.body)

    if(error){
        new CustomError("Validation error: " + error.details[0].message, 400)
    }
    const {name,type,price,offerprice,qty,description,brand,rating,reviews} = value;
    const image = req.file?.path;
    const updateproduct = await product.findByIdAndUpdate(req.params.id, value, { new: true });
    if(!updateproduct){
        return res.send('Product not found with this ID')
    }
    res.status(200).json({ message: "product updated ",updateproduct});
}

const deletproduct = async (req,res)=>{
    const id = req.params.id;
    const deleteproduct = await product.findByIdAndDelete(id)
    if(!deleteproduct){
        return res.json({message:'Product not found with this ID'})
    }
    await cart.updateMany(
        {"product.productId":req.params.id},
        {$pull:{product:{productId:req.params.id}}}
    )
    res.status(200).json({status:"success",message:"product deleted successfully"})
}

module.exports={
    addproduct,
    editproduct,
    deletproduct,
}
