const Order = require("../../Models/Schema/orderschema");
const CustomError = require("../../utils/customError");
// const Cart = require("../../Models/Schema/cartSchema");

const getallorders = async (req, res, next) => {
  const allorders = await Order.find().populate({
    path: "product.productId",
    select: "name price image type",
  });
  res.status(200).json(allorders);
};

// totalproductpurchased
const totalorderproductcount = async (req, res, next) => {
    try {
      const orders = await Order.find().populate({
        path: "product.productId",
        select: "name price image type",
      });
  
      // Calculate total product count
      const totalProductCount = orders.reduce((total, order) => {
        return total + order.product.reduce((orderTotal, item) => {
          return orderTotal + item.quantity;
        }, 0);
      }, 0);
  
      res.json({ message: "Total ordered product count", totalProductCount });
    } catch (error) {
      next(error);
    }
  };
  

// get orders by id

const getordersbyid = async (req, res) => {
  const { id } = req.params.id;
  const order = await Order.findOne({ id }).populate({
    path: "product.productId",
    select: "name price image type",
  });
  console.log(order);
  res.json({ massage: "dhfkjdshfds", order });
};

//total Revenew
const TotalRevenew = async (req, res) => {
  const calculate = await Order.aggregate([
    { $match: { paymentStatus: { $ne: "cancelled" } } },
    {
      $group: {
        _id: null,
        revenew: { $sum: "$amount" },
      },
    },
  ]);
  console.log(calculate);

  // Return 0 if no data is found
  if (calculate.length === 0) {
    return res.status(200).json({ revenew: 0 });
  }

  res.status(200).json({ revenew: calculate[0].revenew });
};

module.exports = {
  getallorders,
  totalorderproductcount,
  getordersbyid,
  TotalRevenew,
};
