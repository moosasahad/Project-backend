const cart = require("../../Models/Schema/cartSchema");
const CustomError = require("../../utils/customError");

// addcart product ---

const addcart = async (req, res) => {
  // console.log("body",req.body);
  const user = req.user.id;
 

  const { productId } = req.body;

  let carts = await cart.findOne({ user });
  console.log('carts',carts)
  console.log('productId1',productId)
  if (carts) {
    const exitingproduct = carts.product.find((item) => {
      return item.productId == productId;
    });
    console.log('productId',exitingproduct)
    // if(!exitingproduct){
      
    //   return (new CustomError("exitingproduct not found", 404));
    // }
    console.log("object existing",exitingproduct)
 
    if (exitingproduct) {
      
      exitingproduct.quantity += 1; 
      res.status(201).json("product quantity increased");
    } else {
      console.log("from add to cart")
      const datad = carts.product.push({ productId: productId, quantity: 1 });
      await carts.save();

      const updatedCart = await carts.populate("product.productId");

      res.status(200).json({
        message: "New product added for the same user",
        cart: updatedCart,
      });
    }
    await carts.save();
  }
  if (!carts) {
    const newcart = new cart({
      user: user,
      product: [{ productId: productId, quantity: 1 }],
    });
    await newcart.save();
    const cartsend = await newcart.populate("product.productId");
    return res.status(201).json(cartsend);
  }
  
  return res.status(200).json({ message: "carte created" });
  // return res.status(200).json("cart created");
};

// get all cart products

const getcartproduct = async (req, res, next) => {
  const user = req.user.id;

  const product = await cart.findOne({ user }).populate("product.productId");
  console.log("cart",product);
  if (!product) {
    return next(new CustomError("Cart not found", 400));
  }

  
  res.status(200).json(product);
};     

// update cart item count

const updatecartcount = async (req, res, next) => {
  const user = req.user.id;
  const { productId, action } = req.body;

  const cartdata = await cart.findOne({ user }).populate("product.productId");
  console.log("cartdata",cartdata);
  

  if (!cartdata) {
    return (new CustomError("product with this id is not found", 404));
  }
  const cartProduct = cartdata.product.find(
    (item) => item.productId._id.toString() == productId
  );
  console.log("cartProduct",cartProduct);
  

  if (!cartProduct) {
    return next(new CustomError("product not found in cart", 404));
  }
  if (action === "increment") {
    cartProduct.quantity += 1;
  } else if (action === "decrement") {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity -= 1;
    } else {
      return res.status(400).json("Quantity cannot be decremented below 1");
    }
  }
  await cartdata.save();
  res.status(200).json({
    message: `Quantity ${
      action === "increment" ? "increased" : "decreased"
    } successfully`,
  });
};

// delete cart item
         
const deletcartitem = async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.body;
    console.log("hsajkdhsahdk cartdelete",productId);
    
  

      const carte = await cart.findOne({ user: userId })
  
      if (!carte) {
        return next(new CustomError("Cart not found", 404));
      }
      console.log("hsajkdhsahdk cartdelete2");
  
      const updatedProducts = carte.product.filter(
        (item) => item.productId != productId
      )
      carte.product = updatedProducts;
      console.log("hsajkdhsahdk cartdelete3");
      await carte.save();
  
      res.status(200).json({ message: "Product deleted from cart" });
  };

  
// clear cart

const deletallproduct = async (req, res, next) => {
    const userId = req.user.id;   
    console.log("cleared");
    

    
    const carte = await cart.findOne({ user: userId }).populate("product.productId");
    if (!carte) {
        return next(new CustomError("Cart not found", 404));
    }

    
    carte.product = [];

    
    await carte.save();

    res.json({ message: "Cart cleared" });
};



module.exports = {
  addcart,
  updatecartcount,
  getcartproduct,
  deletcartitem,
  deletallproduct
};
