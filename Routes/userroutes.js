const express = require("express")
const routes = express.Router();
const logincontroler = require("../Controller/logincontroler");
const tryCatch = require("../Middleware/trycatch");
const userproductcontrooler = require('../Controller/User/userproductcontrooler')
routes

//user registration login logout 
    .post('/signup',tryCatch(logincontroler.userRg))
    .post('/login',tryCatch(logincontroler.userlogin))
    .post('/logut',tryCatch(logincontroler.userlogout))
// product get and post

    .post("/product",tryCatch(userproductcontrooler.addproduct))


 module.exports = routes