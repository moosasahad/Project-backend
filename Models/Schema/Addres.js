const mongoose = require("mongoose");

const AddresSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'user', required: true },
    fullName: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zip: { type: String, required: true }, // Changed to String
    country: { type: String, required: true, trim: true }
});

const Addres = mongoose.model('Addres', AddresSchema);
module.exports = Addres;
