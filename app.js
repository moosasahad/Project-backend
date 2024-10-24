require("dotenv").config()
const express =require("express")
const mongoose =require("mongoose");
const app = express()
const userrout =require('./Routes/userroutes')
app.use(express.json())


app.use(userrout)
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("connected to mongodb"))
.catch((error)=>console.log(error))




const PORT = process.env.PORT || 3000

app.listen(PORT,()=>console.log("server runned"+PORT))