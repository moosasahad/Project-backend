const product = require("../../Models/ProductSchema")



const addproduct = async (req,res,next)=>{
    
 
    
    const {name,type,image,price,offerprice,qty,description,brand,rating,reviews} = req.body

    const newuser = new product({
        name,type,image,price,offerprice,qty,description,brand,rating,reviews
    })
   await newuser.save()
    res.status(200).json("product added"+newuser)
}


module.exports={
    addproduct,
}