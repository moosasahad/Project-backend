const express = require("express")
const routes = express.Router();
const logincontroler = require("../Controller/logincontroler");
const tryCatch = require("../Middleware/trycatch");
routes
    .post('/signup',tryCatch(logincontroler.userRg))



 module.exports = routes