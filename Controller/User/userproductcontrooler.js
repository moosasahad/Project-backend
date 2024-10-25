const product = require("../../Models/ProductSchema")



const addproduct = async (req,res)=>{
    
    const {name,type,image,price,offerprice,qty,description,brand,rating,reviews} = req.body

    const newuser = new product({
        name,type,image,price,offerprice,qty,description,brand,rating,reviews
    })
   await newuser.save()
    res.status(200).json("product added")
}
const getallproducts = async (req,res)=>{
    const producted =await product.find()
   await res.send(producted)
}

const getproductbytype = async (req,res)=>{
    const type = req.params.type;
    console.log("jdhfjs",type);
    
    const products = await product.find({ type: type })
    res.send(products)
}
const getproductbyid = async (req, res,) => {
    const _id = req.params.id;
    const products = await product.findById(_id)
    res.send(products)
  };


module.exports={
    addproduct,
    getallproducts,
    getproductbytype,
    getproductbyid,
}