const Order  =require("../../Models/Schema/orderschema")
const CustomError = require('../../utils/customError')
const Cart = require('../../Models/Schema/cartSchema')

const orderProduct = async (req,res,next) => {

    const usercart = Cart.findOne({user:})
}