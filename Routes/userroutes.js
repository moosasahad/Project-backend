const express = require("express")
const routes = express.Router();
const logincontroler = require("../Controller/logincontroler");
const tryCatch = require("../Middleware/trycatch");
const userproductcontrooler = require('../Controller/User/userproductcontrooler')
const usercartcontroller = require("../Controller/User/usercartcontroller")
const wislistcontorller = require("../Controller/User/wislistcontorller");
const orderProduct = require("../Controller/User/ordercontroller")
const {refreshAccessToken} = require("../Controller/User/Refresh-token")
const {userAuthMiddleware} = require("../Middleware/Authentication")

routes

//user registration login logout 

    .post('/signup',tryCatch(logincontroler.userRg))
    .post('/login',tryCatch(logincontroler.userlogin))
    .post('/logut',tryCatch(logincontroler.userlogout))

// productcontroller get,post
 
    .post("/product",tryCatch(userproductcontrooler.addproduct))
    .get('/product',tryCatch(userproductcontrooler.getallproducts))
    .get('/product/:type',tryCatch(userproductcontrooler.getproductbytype))
    .get('/productid/:id',tryCatch(userproductcontrooler.getproductbyid))

// user cart contorller

    .post('/addcart',userAuthMiddleware,tryCatch(usercartcontroller.addcart))
    .get('/getcart',userAuthMiddleware,tryCatch(usercartcontroller.getcartproduct))
    .post('/updatecartcount',userAuthMiddleware,tryCatch(usercartcontroller.updatecartcount))
    .delete('/cartdelete',userAuthMiddleware,tryCatch(usercartcontroller.deletcartitem))

//wishlist routers

    .post('/wishlist',userAuthMiddleware,tryCatch(wislistcontorller.wishlistadd))
    .delete('/wishlistremive',userAuthMiddleware,tryCatch(wislistcontorller.remiveiteminwishlist))
    .get('/whislistget',userAuthMiddleware,tryCatch(wislistcontorller.getwishlist))
// orer ----

    // .post('/order',tryCatch(orderProduct.orderProduct))

//refresh token........
     .post("/refreshtoken",refreshAccessToken)

 module.exports = routes