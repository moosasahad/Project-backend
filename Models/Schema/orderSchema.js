const { string } = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'user', required: true },
    
    product: [{
        productId: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
    }],
    addres: { type: mongoose.Schema.ObjectId, ref: 'Addres', required: true },
    sessionId: { type: String },
    purchaseDate: { type: Date, default: Date.now },
    sessionID:{type:String},
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", 'completed', "cancelled"], default: 'pending' },
    shippingStatus: { type: String, enum: ["pending", 'completed', "cancelled", "Processing"], default: "Processing" }
});

module.exports = mongoose.model("order", orderSchema);
 