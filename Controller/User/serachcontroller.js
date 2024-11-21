const Product = require('../../Models/Schema/ProductSchema')

const searchcontroller = async (req,res,next) =>{
        const query = req.query.q; 
        console.log("query",query);
        
        if (!query) {
          return res.status(400).json({ message: "Search query is required" });
        }
    
        
        const products = await Product.find({
          name: { $regex: query, $options: "i" }, 
        });
    
        res.json(products);
    

}

module.exports={
    searchcontroller
}