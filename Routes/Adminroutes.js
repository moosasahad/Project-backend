
const express = require("express");
const routes = express.Router();
const logincontroler = require('../Controller/logincontroler')
const tryCatch = require('../Middleware/trycatch')
const adminproduct = require("../Controller/Admin/adminproductcontroller")
const oredrdetails = require('../Controller/Admin/purchasedproduct')


routes

// get all users
    .get('/getuser',tryCatch(logincontroler.getallusersinadmin))
    .get('/getuser/:id',tryCatch(logincontroler.getspscificser))

// product inadmin

    .post("/product",tryCatch(adminproduct.addproduct))
    .get('/product',tryCatch(adminproduct.getallproducts))
    .get('/product/:type',tryCatch(adminproduct.getproductbytype))
    .get('/productid/:id',tryCatch(adminproduct.getproductbyid))

// orders ....
    .get("/orders",tryCatch(oredrdetails.getallorders))
    .get("/totalproduct",tryCatch(oredrdetails.totalorderproductcount))
    .get("/getproductbyid/:id",tryCatch(oredrdetails.getordersbyid))
    .get("/totalrevannu",tryCatch(oredrdetails.TotalRevenew))
   



module.exports= routes