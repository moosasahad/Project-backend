const product = require("../../Models/Schema/ProductSchema")


const getallproducts = async (req,res)=>{
    const producted =await product.find()
    res.status(200).json({status:"succsses",message:"all product", producted})
   
}

const getproductbytype = async (req,res)=>{
    const type = req.params.type;
    if(!type){
        res.status(401).json({status:"faild",message:"type is not fount"})
    }
    console.log("jdhfjs",type);
    
    const products = await product.find({ type: type })
    res.status(200).json({status:"succsses",message:"product by type",type:req.params.type, products})
}
const getproductbyid = async (req, res,) => {
    if(req.params.id.length!== 24){
        res.status(401).json({status:"faild",message:"id is not valid"})
    }
    const id = req.params.id;
    const products = await product.findById(id)
    res.status(200).json({status:"succsses",message:"product by type",type:req.params.id,products})
  };


module.exports={
    getallproducts,
    getproductbytype,
    getproductbyid,
}