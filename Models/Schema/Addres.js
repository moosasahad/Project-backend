const mongoose = require("mongoose");

const AddresSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }, 
    product: [{
        productId: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true }, 
        quantity: { type: Number, required: true, default: 1 }
    }]
});

const cart = mongoose.model('cart', cartSchema);
module.exports = cart;
