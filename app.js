require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const errorhandler = require("./Middleware/errorhandler");
const app = express();
const userrout = require("./Routes/userroutes");
const Adminroutes = require("./Routes/Adminroutes")
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cookieParser());
app.use(express.json());
app.use(errorhandler);
app.use(cors());

app.use(cors({
  origin: "http://localhost:3001" // Adjust this to the origin you need
}));
app.use(userrout);
app.use("/admin",Adminroutes)
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
