// const Order  =require("../../Models/Schema/orderschema")
// const CustomError = require('../../utils/customError')
// const Cart = require('../../Models/Schema/cartSchema')

// const orderProduct = async (req,res,next) => {
//     const {user} = req.body;

//     const usercart = Cart.findOne({user}).populate("product.productId")
//     if(!usercart){
//         return next(CustomError("user cart not found",404))
//     }
//     const totalprice = Math.round(
//         usercart.product.reduce((total,item)=>{
//             const price = parseFloat(item.product.new_price);
//             const quantity = parseInt(item.guantity);
//             if(isNaN(price) || isNaN(quantity)){
//                 return next(CustomError('invalid product price or quantity'))

//             }
//             return total + price * quantity;
//         },0)
        
//     )
//     const newOrder = new Order({
//         userId: req.user.id,
//         products: usercart.product,
//         sessionId: 23452343,
//         amount: totalprice,
//         paymentStatus: 'pending'
//     });
//     const savedOrder = await newOrder.save();
//     await Cart.findOneAndUpdate({ user }, { $set: { products: [] } });

//     res.status(200).json({ savedOrder });
// }

// module.exports ={
//     orderProduct,
// }