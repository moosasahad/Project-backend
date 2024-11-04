
const jwt=require("jsonwebtoken");
const CustomError = require("../utils/customError")

const userAuthMiddleware = async (req, res, next) => {
    try {
      const token=req.cookies.token
      console.log("nihal",token)
     if(!token){
      return res.status(401).send("Authentication token missing");
     }
        
        if (token) {
          jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
            
            if(err){
                res.send(err)
            }else{
                req.user=user
                console.log('aslah',req.user);
                
                next()
            }
          });
        } else {
        
        res.status(404).send("not authenticate")
        }
      } catch (error) {
      
        res.send(error)
      }
    };
  //  adminAuthMiddleware...........

  const adminAuthMiddleware = async (req,res,next)=>{
    try {
      const admintoken=req.cookies.admintoken
      console.log("nihal",admintoken)
     if(!admintoken){
      return res.status(401).send(" admin Authentication token missing");
     }
        
        if (admintoken) {
          jwt.verify(admintoken, process.env.ADMIN_JWT_TOKEN, (err, user) => {
            
            if(err){
                res.send(err)
            }else{ 
                req.user=user
                console.log('aslah',req.user);
                
                next()
            }
          });
        } else {
        
        res.status(404).send("not authenticate")
        }
      } catch (error) {
      
        res.send(error)
      }
  }
    


module.exports={userAuthMiddleware,adminAuthMiddleware}