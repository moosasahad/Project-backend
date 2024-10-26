const express = require("express")
const routes = express.Router();
const logincontroler = require("../Controller/logincontroler");
const tryCatch = require("../Middleware/trycatch");
const userproductcontrooler = require('../Controller/User/userproductcontrooler')
const usercartcontroller = require("../Controller/User/usercartcontroller")

routes

//user registration login logout 

    .post('/signup',tryCatch(logincontroler.userRg))
    .post('/login',tryCatch(logincontroler.userlogin))
    .post('/logut',tryCatch(logincontroler.userlogout))

// product get,post,addcart and wishlist
 
    .post("/product",tryCatch(userproductcontrooler.addproduct))
    .get('/product',tryCatch(userproductcontrooler.getallproducts))
    .get('/product/:type',tryCatch(userproductcontrooler.getproductbytype))
    .get('/productid/:id',tryCatch(userproductcontrooler.getproductbyid))

// user cart contorller

    .post('/addcart',tryCatch(usercartcontroller.addcart))


 module.exports = routes