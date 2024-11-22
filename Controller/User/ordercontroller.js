const Order = require("../../Models/Schema/orderschema");
const CustomError = require("../../utils/customError");
const Cart = require("../../Models/Schema/cartSchema");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe");
const Addres = require("../../Models/Schema/Addres");
const { userAuthMiddleware } = require("../../Middleware/Authentication");

//create new orer

const orderProduct = async (req, res, next) => {
  const userCart = await Cart.findOne({ user: req.user.id }).populate(
    "product.productId"
  );
  console.log("userCart", userCart);    
const useradress = await Addres.findOne({ user: req.user.id }).sort({_id:-1})
console.log("useradress",useradress);

  if (!userCart) {
    return next(new CustomError("User cart not found", 404));
  }

  const totalPrice = Math.round(
    userCart.product.reduce((total, item) => {
      const price = parseFloat(item.productId.price);
      console.log("price", price);

      const quantity = parseInt(item.productId.qty);
      console.log("quantity", quantity);

      if (isNaN(price) || isNaN(quantity)) {
        return next(new CustomError("Invalid product price or quantity"));
      }
      return total + price * quantity;
    }, 0)
  );
  console.log("totalPrice", totalPrice);

  const lineItems = userCart.product.map((item) => {
    const price = parseFloat(item.productId.price);
    console.log("hgjk[poiuytyuiooiuytfgjklkjhgfd8765456789", price);
    if (isNaN(price)) {
      return next(new CustomError("Invalid product price"));
    }

    return {
      price_data: {
        currency: "INR",
        product_data: {
          name: item.productId.name,
          images: [item.productId.image],
        },
        unit_amount: Math.round(price * 100), 
      },
      quantity: item.quantity,
    };
  });
  console.log("lineItems", lineItems);

  const stripeclint = new stripe(process.env.STRIPE_KEY);
  console.log(stripeclint);

  const session = await stripeclint.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    ui_mode: "embedded",
    return_url: `${process.env.URL_FRONTEND}/orders/{CHECKOUT_SESSION_ID}`,
  });
  console.log("session id", session.id);

  const newOrder = new Order({
    addres:useradress,
    userId: req.user.id,
    product: userCart.product,
    sessionID: session.id,
    amount: totalPrice,
    paymentStatus: "pending",
  });

  const savedOrder = await newOrder.save();
  

  res.status(200).json({
    message: "order created succesfully",
    data: {
      session: session,
      order: savedOrder,
      clientsecret: session.client_secret,
      linedata: lineItems,
    },
  });
  // const user = req.user.id;

  // const usercart = await Cart.findOne({ user: req.user.id }).populate(
  //   "product.productId"
  // );
  // if (!usercart) {
  //   return next(new CustomError("User cart not found", 404));
  // }
  // const totalprice = Math.round(
  //   usercart.product.reduce((total, item) => {
  //     const price = parseFloat(item.productId.price);
  //     console.log("price", price);

  //     const quantity = parseInt(item.productId.qty);
  //     console.log("quantity", quantity);

  //     if (isNaN(price) || isNaN(quantity)) {
  //       return next(new CustomError("Invalid product price or quantity"));
  //     }
  //     return total + price * quantity;
  //   }, 0)
  // );
  // const sessionId = uuidv4();
  // const neworder = new Order({
  //   userId: user,
  //   product: usercart.product,
  //   sessionId: sessionId,
  //   amount: totalprice,
  //   paymentStatus: "pending",
  // });
  // const saveorder = await neworder.save();

  // res.send(usercart);
};

// get all orders .......

const getallorders = async (req, res, next) => {
  try {
    // Fetch orders where userId matches the logged-in user's ID
    const allorders = await Order.find({ userId: req.user.id })
      .populate("userId", "-password") 
      .populate("product.productId")
      .populate("addres")
      .lean(); 

    // Check if orders exist
    if (!allorders || allorders.length === 0) {
      return next(new CustomError("No orders found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders: allorders,
    });
  } catch (error) {
    // Handle unexpected errors
    next(new CustomError("Failed to fetch orders", 500));
  }
};

// verifyorder .....

const verifyOrder = async (req, res, next) => {
  const order = await Order.findOne({ sessionID: req.params.id });
  console.log("Order ID:", req.params.id);
  console.log("sessionId", order);

  if (!order) {
    return next(new CustomError("Order with this sessionId is not found", 404));
  }
  if (order.paymentStatus === "completed") {
    return res.status(400).json("Product already updated");
  }
  order.paymentStatus = "completed";
  order.shippingStatus = "Processing";

  await order.save();

  res.status(200).json("Order successfully updated");
};

// cansel order ...

const canselorder = async (req, res, next) => {
  const order = await Order.findOne({ sessionID: req.params.id });
  console.log("Order ID:", order);

  if (!order) {
    return next(new CustomError("Order with this ID is not found", 404));
  }
  // if (order.paymentStatus === "completed") {
  //   return res.status(400).json("Cannot cancel this order, already paid");
  // }
  order.paymentStatus = "cancelled";
  order.shippingStatus = "cancelled";

  await order.save();

  res.status(200).json("Order successfully cancelled");
};

const Addrescontroler = async (req, res, next) => {
  
  const user = req.user;

        // Check if the user is authenticated
        if (!user || !user.id) {
            return res.status(401).json({
                status: "failure",
                message: "User is not authenticated."
            });
        }

        console.log("User ID:", user.id);
        console.log("Request Body:", req.body);

        const { fullName, street, city, state, zip, country } = req.body.address || {};

        if (!fullName || !street || !city || !state || !zip || !country) {
            return res.status(400).json({
                status: "failure",
                message: "All address fields (fullName, street, city, state, zip, country) are required."
            });
        }

        // Create a new address
        const newAddres = new Addres({
            user: user.id,
            fullName,
            street,
            city,
            state,
            zip,
            country
        });

        await newAddres.save();


        const populatedAddres = await newAddres.populate("user");

        return res.status(200).json({
            status: "success",
            message: "Address added successfully.",
            data: populatedAddres
        });
};

module.exports = {
  orderProduct,
  getallorders,
  canselorder,
  verifyOrder,
  Addrescontroler,
};
