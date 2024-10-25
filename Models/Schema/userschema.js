const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    name:{type: String, required:true,trim:true},
    email:{type:String,required:true,trim:true},
    number:{type:Number,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    confirmpassword:{type:String,required:true,trim:true},
    admin:{type:Boolean, default:false},
    status:{type: Boolean,default:false}
})

module.exports = mongoose.model("user",userschema)