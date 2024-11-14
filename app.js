require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const errorhandler = require("./Middleware/errorhandler");
const app = express();
const userrout = require("./Routes/userroutes");
const Adminroutes = require("./Routes/Adminroutes")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const CustomError = require("./utils/customError")

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(errorhandler);
  


app.use(userrout);
app.use("/admin",Adminroutes) 
// Custom error handler middleware
app.use((err, req, res, next) => {
    if (err instanceof CustomError) {
        // Handle known custom errors
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    } else {  
        // Handle unknown errors
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }
  })

mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 30000, // Optional: Increase timeout if needed
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("server runned " + PORT));
