const product = require("../../Models/Schema/ProductSchema")


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
    getallproducts,
    getproductbytype,
    getproductbyid,
}