const Order = require("../../Models/Schema/orderschema");
const CustomError = require("../../utils/customError");
const Cart = require("../../Models/Schema/cartSchema");
const { v4: uuidv4 } = require("uuid");

//create new orer

const orderProduct = async (req, res, next) => {
  const user = req.user.id;

  const usercart = await Cart.findOne({ user: req.user.id }).populate(
    "product.productId"
  );
  if (!usercart) {
    return next(new CustomError("User cart not found", 404));
  }
  const totalprice = Math.round(
    usercart.product.reduce((total, item) => {
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
  const sessionId = uuidv4();
  const neworder = new Order({
    userId: user,
    product: usercart.product,
    sessionId: sessionId,
    amount: totalprice,
    paymentStatus: "pending",
  });
  const saveorder = await neworder.save();

  res.send(usercart);
};

// get all orders .......

const getallorders = async (req, res, next) => {
  const allorders = await Order.find({ userId: req.user.id }).populate(
    "product.productId"
  )

  if (!allorders || allorders.length === 0) {
    return next(new CustomError("No orders found", 404));
  }
  res.status(200).json(allorders);
};

// verifyorder .....

const verifyOrder = async (req, res, next) => {
  const order = await Order.findOne({ sessionId: req.params.id });
  console.log("Order ID:", req.params.id);
  console.log("sessionId",order);
  

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
  const order = await Order.findOne({ sessionId: req.params.id });
  console.log("Order ID:", req.params.id);

  if (!order) {
    return next(new CustomError("Order with this ID is not found", 404));
  }
  if (order.paymentStatus === "completed") {
    return res.status(400).json("Cannot cancel this order, already paid");
  }
  order.paymentStatus = "cancelled";
  order.shippingStatus = "cancelled";

  await order.save();

  res.status(200).json("Order successfully cancelled");
};

module.exports = {
  orderProduct,
  getallorders,
  canselorder,
  verifyOrder,
};
