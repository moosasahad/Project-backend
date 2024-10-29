const mongoose = require("mongoose")


const orderSchema = new mongoose.model({
    userId:{type:mongoose.Schema.ObjectId,ref:'user',required:true},
    product:[{
        productId:{type:mongoose.Schema.ObjectId,ref:'Product',required:true},
        quantity:{type:Number,required:true,default:1},
    }],
    sessionId:{type:String},
    purchaseDate:{type:Date,default:Date.now},
    amount:{type:Number,required:true},
    paymentStatus:{type:String,enum:["pending",'completed',"cancelled"],default:'pending'},
    shippingStatus: { type: String,enum:["pending",'completed',"cancelled"] ,default: "pending" }
})

module.exports = mongoose.model("order",orderSchema)