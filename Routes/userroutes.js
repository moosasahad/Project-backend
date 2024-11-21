const express = require("express")
const routes = express.Router();
const logincontroler = require("../Controller/logincontroler");
const tryCatch = require("../Middleware/trycatch");
const userproductcontrooler = require('../Controller/User/userproductcontrooler')
const usercartcontroller = require("../Controller/User/usercartcontroller")
const wislistcontorller = require("../Controller/User/wislistcontorller");
const orderProduct = require("../Controller/User/ordercontroller")
const refreshAccessToken = require("../Controller/User/Refresh-token")
const Authentication = require("../Middleware/Authentication")
const serachcontroller = require("../Controller/User/serachcontroller")

routes

//user registration login logout 

    .post('/signup',tryCatch(logincontroler.userRg))
    .post('/login',tryCatch(logincontroler.userlogin))
    .post('/logut',tryCatch(logincontroler.userlogout))
    .post('/adminlogut',tryCatch(logincontroler.adminlogout))

// productcontroller get,post
 
    // .post("/product",Authentication.userAuthMiddleware,tryCatch(userproductcontrooler.addproduct))
    .get('/product',tryCatch(userproductcontrooler.getallproducts))
    .get('/product/:type',tryCatch(userproductcontrooler.getproductbytype))
    .get('/productid/:id',tryCatch(userproductcontrooler.getproductbyid))

// user cart contorller

    .post('/addcart',Authentication.userAuthMiddleware,tryCatch(usercartcontroller.addcart))
    .get('/getcart',Authentication.userAuthMiddleware,tryCatch(usercartcontroller.getcartproduct))
    .post('/updatecartcount',Authentication.userAuthMiddleware,tryCatch(usercartcontroller.updatecartcount))
    .delete('/cartdelete',Authentication.userAuthMiddleware,tryCatch(usercartcontroller.deletcartitem))
    .delete('/clearcart',Authentication.userAuthMiddleware,tryCatch(usercartcontroller.deletallproduct))

//wishlist routers

    .post('/wishlist',Authentication.userAuthMiddleware,tryCatch(wislistcontorller.wishlistadd))
    .delete('/wishlistremive',Authentication.userAuthMiddleware,tryCatch(wislistcontorller.remiveiteminwishlist))
    .get('/whislistget',Authentication.userAuthMiddleware,tryCatch(wislistcontorller.getwishlist))
    .get('/counte',Authentication.userAuthMiddleware,tryCatch(wislistcontorller.count))
// orer ----

    .post('/order',Authentication.userAuthMiddleware,tryCatch(orderProduct.orderProduct))
    .get('/getallorders',Authentication.userAuthMiddleware,tryCatch(orderProduct.getallorders))
    .post('/ordercancel/:id',Authentication.userAuthMiddleware,tryCatch(orderProduct.canselorder))
    .post('/verifyOrder/:id',Authentication.userAuthMiddleware,tryCatch(orderProduct.verifyOrder))
    
    
    .post('/serachcontroller',tryCatch(serachcontroller.searchcontroller))
//refresh token........
     .post("/refreshtoken",refreshAccessToken.refreshAccessToken)
     


 module.exports = routes