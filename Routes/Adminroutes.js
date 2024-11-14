
const express = require("express");
const routes = express.Router();
const logincontroler = require('../Controller/logincontroler')
const tryCatch = require('../Middleware/trycatch')
const adminproduct = require("../Controller/Admin/adminproductcontroller")
const oredrdetails = require('../Controller/Admin/purchasedproduct')
const productcontroller = require('../Controller/Admin/produadd')
const upload = require("../Middleware/imgaeuplode")
const Authentication =require("../Middleware/Authentication")
const refreshAccessToken = require("../Controller/User/Refresh-token")
routes

// get all users
    .get('/getuser',Authentication.adminAuthMiddleware,tryCatch(logincontroler.getallusersinadmin))
    .get('/getuser/:id',Authentication.adminAuthMiddleware,tryCatch(logincontroler.getspscificser))
    .post('/useblock',Authentication.adminAuthMiddleware,tryCatch(logincontroler.userblocking))

// product inadmin

    .get('/product',Authentication.adminAuthMiddleware,tryCatch(adminproduct.getallproducts))
    .get('/product/:type',Authentication.adminAuthMiddleware,tryCatch(adminproduct.getproductbytype))
    .get('/productid/:id',Authentication.adminAuthMiddleware,tryCatch(adminproduct.getproductbyid))

// orders ....
    .get("/orders",Authentication.adminAuthMiddleware,tryCatch(oredrdetails.getallorders))
    .get("/totalproduct",Authentication.adminAuthMiddleware,tryCatch(oredrdetails.totalorderproductcount))
    .get("/getproductbyid/:id",Authentication.adminAuthMiddleware,tryCatch(oredrdetails.getordersbyid))
    .get("/totalrevannu",Authentication.adminAuthMiddleware,tryCatch(oredrdetails.TotalRevenew))
// product add update delet

    .post("/addproduct",Authentication.adminAuthMiddleware,upload.single('image'),tryCatch(productcontroller.addproduct))
    .post("/editproduct/:id",Authentication.adminAuthMiddleware,upload.single('image'),tryCatch(productcontroller.editproduct))
    .delete("/deletproduct/:id",Authentication.adminAuthMiddleware,tryCatch(productcontroller.deletproduct))    

// refreshAccessToken

    .post('/refresh',refreshAccessToken.adminrefreshAccessToken)


module.exports= routes