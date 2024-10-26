const cart = require("../../Models/Schema/cartSchema")


// addcart product --- 

const addcart = async (req,res)=>{
    console.log("body",req.body);
    
    const {productId,user} = req.body;
 
    
    let carts = await cart.findOne({user});
    console.log("fdaf",carts);
    
if(carts){
    const exitingproduct = cart.product.find((item)=>{
        return item.productId==productId

        

    })
    console.log("exitingproduct",exitingproduct);
    
if(exitingproduct){
    exitingproduct.quantity+=1
}else{
    cart.product.push({productId:productId,quantity:1})
}
    await cart.save()
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
    return res.status(201).json("cartsend");
}

module.exports={
    addcart,
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
