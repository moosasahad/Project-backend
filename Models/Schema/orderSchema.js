const { string } = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'users', required: true },
    
    product: [{
        productId: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
    }],
    sessionId: { type: String },
    purchaseDate: { type: Date, default: Date.now },
    sessionID:{type:String},
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", 'completed', "cancelled"], default: 'pending' },
    shippingStatus: { type: String, enum: ["pending", 'completed', "cancelled", "Processing"], default: "Processing" }
});

module.exports = mongoose.model("order", orderSchema);
 