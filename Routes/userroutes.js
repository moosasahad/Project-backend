const express = require("express")
const routes = express.Router();
const trycatch = require("../Middleware/trycatch")
const logincontroler = require("../Controller/logincontroler")
routes
    .post('/signup',logincontroler.userRg)



 module.exports = routes