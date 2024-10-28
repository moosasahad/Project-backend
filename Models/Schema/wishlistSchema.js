const mongoose = require('mongoose')

const wishlistSchema= new mongoose.Schema({
    user:{type:mongoose.Schema.ObjectId,ref:'User'},
    product:[{type:mongoose.Schema.ObjectId,ref:'Product'}]
})

module.exports = mongoose.mongoose.model("whishlists",wishlistSchema)