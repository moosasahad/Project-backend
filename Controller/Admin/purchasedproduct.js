const Order = require("../../Models/Schema/orderschema");
const CustomError = require("../../utils/customError");
// const Cart = require("../../Models/Schema/cartSchema");
const currentDate = new Date();
const getallorders = async (req, res, next) => {
  console.log("useride",req.user.id )
    const allorders = await Order.find() 
      .populate("userId", "-password")
      .populate("product.productId") 
      .populate("addres")
      .lean(); 
console.log("allorders",allorders);

    if (!allorders || allorders.length === 0) {
      return next(new CustomError("No orders found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders: allorders,
    });
};

// totalproductpurchased

const totalorderproductcount = async (req, res, next) => {

      const orders = await Order.find().populate({
        path: "product.productId",
        select: "name price image type",
      });
      const totalProductCount = orders.reduce((total, order) => {
        return total + order.product.reduce((orderTotal, item) => {
          return orderTotal + item.quantity;
        }, 0);
      }, 0);
  
      res.json({ message: "Total ordered product count", totalProductCount });

  };
  

// get orders by id

const getordersbyid = async (req, res) => {
  const id = req.params.id;
  const order = await Order.find({userId:id }).populate("product.productId").populate("userId").populate("addres")
     
  console.log(order);
  res.json({ massage: "orders by id", order });
};

//-----total Revenew-----
const TotalRevenew = async (req, res) => {
  // ------ Calculate total revenue excluding cancelled payments ----
  const calculate = await Order.aggregate([
    { $match: { paymentStatus: { $ne: "cancelled" } } },
    {
      $group: {
        _id: null,
        revenew: { $sum: "$amount" },
      },
    },
  ]);
  console.log("Total Revenue:", calculate);

  // ---- Get today's date without time ----
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);  
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);  

  console.log("currentDate", currentDate);
  console.log("nextDay", nextDay);

  // --- Calculate daily revenue ---
  const dailyrevanu = await Order.aggregate([
    {
      $match: {
        purchaseDate: { $gte: currentDate, $lt: nextDay }, 
        paymentStatus: { $ne: "cancelled" } 
      }
    },
    {
      $group: {
        _id: null,
        revenew: { $sum: "$amount" }, 
      }
    }
  ]);
  console.log("Daily Revenue:", dailyrevanu);
        
  const totalRevenue = calculate.length > 0 ? calculate[0].revenew : 0;
  const dailyRevenue = dailyrevanu.length > 0 ? dailyrevanu[0].revenew : 0;

  res.status(200).json({ message:"sucsses", totalRevenue: totalRevenue, dailyRevenue: dailyRevenue });

};

const getmostusers =async (req,res,next)=>{
  const mostorder =await Order.find().sort({ purchaseDate:-1 }).populate("userId", "-password")

console.log("sdfghjk",mostorder)
res.status(200).json({mesage:"resend orders",mostorder})
}




module.exports = {
  getallorders,
  totalorderproductcount,
  getordersbyid,
  TotalRevenew,
  getmostusers,
};
