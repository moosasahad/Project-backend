
const mongoose = require("mongoose")


const ProductScchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, 
    name: { type: String, required: true,unique: true,trim:true},
    type: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }, 
    offerprice: {type:Number},
    qty: { type: Number, min: 0 },
    description: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0, max:10}, 
    brand: { type: String,required: true },
   
})

module.exports = mongoose.model("Product",ProductScchema)

