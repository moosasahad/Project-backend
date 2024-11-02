
const express = require("express");
const routes = express.Router();
const logincontroler = require('../Controller/logincontroler')
const tryCatch = require('../Middleware/trycatch')
const adminproduct = require("../Controller/Admin/adminproductcontroller")
const oredrdetails = require('../Controller/Admin/purchasedproduct')
const productcontroller = require('../Controller/Admin/produadd')
const upload = require("../Middleware/imgaeuplode")


routes

// get all users
    .get('/getuser',tryCatch(logincontroler.getallusersinadmin))
    .get('/getuser/:id',tryCatch(logincontroler.getspscificser))

// product inadmin

    .get('/product',tryCatch(adminproduct.getallproducts))
    .get('/product/:type',tryCatch(adminproduct.getproductbytype))
    .get('/productid/:id',tryCatch(adminproduct.getproductbyid))

// orders ....
    .get("/orders",tryCatch(oredrdetails.getallorders))
    .get("/totalproduct",tryCatch(oredrdetails.totalorderproductcount))
    .get("/getproductbyid/:id",tryCatch(oredrdetails.getordersbyid))
    .get("/totalrevannu",tryCatch(oredrdetails.TotalRevenew))
// product add update delet

.get("/addproduct",upload.single('image'),tryCatch(productcontroller.addproduct)) 



module.exports= routes