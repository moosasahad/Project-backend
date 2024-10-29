const express = require("express")
const routes = express.Router();
const logincontroler = require("../Controller/logincontroler");
const tryCatch = require("../Middleware/trycatch");
const userproductcontrooler = require('../Controller/User/userproductcontrooler')
const usercartcontroller = require("../Controller/User/usercartcontroller")
const wislistcontorller = require("../Controller/User/wislistcontorller");
const orderProduct = require("../Controller/User/ordercontroller")
const {refreshAccessToken} = require("../Controller/User/Refresh-token")

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

    .post('/addcart',tryCatch(usercartcontroller.addcart))
    .get('/getcart',tryCatch(usercartcontroller.getcartproduct))
    .post('/updatecartcount', tryCatch(usercartcontroller.updatecartcount))
    .delete('/cartdelete', tryCatch(usercartcontroller.deletcartitem))

//wishlist routers

    .post('/wishlist',tryCatch(wislistcontorller.wishlistadd))
    .delete('/wishlistremive',tryCatch(wislistcontorller.remiveiteminwishlist))
    .get('/whislistget',tryCatch(wislistcontorller.getwishlist))

// orer ----

    // .post('/order',tryCatch(orderProduct.orderProduct))

//refresh token........
     .post("/refreshtoken",refreshAccessToken)

 module.exports = routes