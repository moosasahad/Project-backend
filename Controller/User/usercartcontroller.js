const cart = require("../../Models/Schema/cartSchema")
const CustomError = require("../../utils/customError")


// addcart product --- 

const addcart = async (req,res)=>{
    // console.log("body",req.body);
    const user = req.user.id;
    console.log("user in cart",user);
    
    const {productId} = req.body;
 
    
    let carts = await cart.findOne({user});
    console.log("fdaf",carts); 

if(carts){
    const exitingproduct = carts.product.find((item)=>{
        return item.productId==productId
    })
    
if(exitingproduct){
    exitingproduct.quantity += 1
    res.status(201).json("product quantity increased")
}else{
    carts.product.push({productId:productId,quantity:1})
    res.status(200).json("new product added in same user")
}
    await carts.save()
}
    if(!carts){
        const newcart = new cart({
            user:user,
            product:[{productId:productId, quantity:1}]
        })
        await newcart.save()
        const cartsend = await newcart.populate('product.productId');
        return res.status(201).json(cartsend);

    }
    return res.status(200).json("carte created")
    // return res.status(200).json("cart created");
}

// get all cart products

const getcartproduct = async (req,res,next)=>{
    const user = req.user.id;
    
    
    const product =await cart.findOne({user}).populate('product.productId');
    if(!product){
        return next(new CustomError('Cart not found', 400))
    }
    res.status(200).json(product);
    
}

// update cart item count


const updatecartcount = async (req,res,next ) => {
    const user = req.user.id
    const {productId, action,} = req.body;
    
    
    const cartdata = await cart.findOne({user}).populate('product.productId');
    

    if(!cartdata) {
        return next(new CustomError('product with this id is not found', 404))
    }
    const cartProduct = cartdata.product.find(item => item.productId._id.toString() == productId);
   
    if(!cartProduct){
        return next(new CustomError('product not found in cart', 404))
    }
    if(action === "increment"){
        cartProduct.quantity += 1;        
        // res.send("quantity increased")
    }else if(action === "decrement" ){
        if(cartProduct.quantity > 1){
            cartProduct.quantity -= 1;
            // res.send("quantity decrement")
        }else{
            return res.status(400).json("Quantity cannot be decremented below 1");
        }
    
}
await cartdata.save();
res.status(200).json({ message: `Quantity ${action === "increment" ? "increased" : "decreased"} successfully` });
}

// delete cart item 

const deletcartitem = async (req,res,next)=>{
    const user = req.user.id;
    const {productId} = req.body;
    
    const product = await cart.findOne({user}).populate('product.productId');

    if(!product){
        return next(new CustomError("cart not found",404))
    }

    const flterproduct = product.product.filter(item=>item.productId._id.toString() !== productId);
    product.product = flterproduct;
    product.save()
    res.status(201).json('product deleted')
    
}

module.exports={
    addcart,
    updatecartcount,
    getcartproduct,
    deletcartitem,
}

// const Cart = require("../../Models/Schema/cartSchema");

// // Add product to cart
// const addcart = async (req, res) => {
//   console.log("Request body:", req.body);

//   const { productId, user } = req.body;

//   // Find the cart for the specific user
//   let carts = await Cart.findOne({ user }).populate('product.productId');
//   console.log("Existing cart:", carts);

//   // If the cart exists
//   if (carts) {
//     // Check if the product is already in the cart
//     const existingProduct = carts.product.find((item) => item.productId == productId);
//     console.log("Existing product:", existingProduct);

//     if (existingProduct) {
//       // Increase quantity if product exists
//       existingProduct.quantity += 1;
//     } else {
//       // Add new product if it doesn't exist in the cart
//       carts.product.push({ productId: productId, quantity: 1 });
//     }

//     // Save changes to the cart
//     await carts.save();
//     return res.status(201).json(carts);
//   } 
  
//   // If the cart does not exist, create a new one
//   if (!carts) {
//     const newCart = new Cart({
//       user: user,
//       product: [{ productId: productId, quantity: 1 }]
//     });
//     await newCart.save();
//     const cartsend = await newCart.populate('product.productId');
//     return res.status(201).json(cartsend);
//   }
// };

// module.exports = {
//   addcart,

// };
