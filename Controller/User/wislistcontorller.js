const wishlist = require('../../Models/Schema/wishlistSchema')
const Cart = require("../../Models/Schema/cartSchema")
const CustomError = require('../../utils/customError')

// add product to wishlist

const wishlistadd = async (req,res,next)=>{
    const {productId} = req.body;
    const user = req.user.id

    let wishuser =await wishlist.findOne({user})
    console.log(wishuser);
    if(!wishuser){
        const newlist = new wishlist({
            user:user,
            product:[productId]
        })
        await newlist.save()
        const list = await newlist.populate('product')

        return res.status(200).json({"massage":"product added whishlist",list});
    }
    const productExists = wishuser.product.find(product => product==productId)
    console.log("productExists",productExists);
    if(!productExists){
        wishuser.product.push(productId)
        await wishuser.save();
        wishuser = await wishuser.populate('product');
        return res.status(200).json({"massage":"new product adde to same user",wishuser});
    }
    res.send({"message":"products already added to the wishlist",wishuser})
    

}
// remove product in wishlist

const remiveiteminwishlist = async (req, res, next) => {
    const { productId } = req.body;
    const user = req.user.id

    let wishlistuser = await wishlist.findOne({ user });

    if (!wishlistuser) {
        return res.status(404).json({ message: "Wishlist not found for this user" });
    }

    const filteredWishlist = wishlistuser.product.filter(item => !item.equals(productId));
    wishlistuser.product = filteredWishlist
    wishlistuser.save()
 
    res.status(200).json({ message: "Product removed from wishlist" });
};

// get wishlist product

const getwishlist = async (req,res,next)=>{
    const {productId} = req.body;
    const user = req.user.id

    const whislisted =await wishlist.findOne({user}).populate('product')
    if(!whislisted){
        return next(new CustomError('whishlist not found', 400))
    }
    res.status(200).json(whislisted);
    
}

const count = async (req, res, next) => {
    try {
      // Fetch the cart for the specific user
      const cart = await Cart.findOne({ user: req.user.id });
      
      if (!cart) {
        return res.status(404).send("Cart not found");
      }
  
      // Count the number of unique products in the cart
      const productCount = cart.product.length;
  
      console.log("Cart count:", productCount);
  
      res.json({ count: productCount });
    } catch (error) {
      console.error("Error counting cart products:", error);
      res.status(500).send("Server Error");
    }
  };
  
module.exports= {
    wishlistadd,
    remiveiteminwishlist,
    getwishlist,
    count,
}
