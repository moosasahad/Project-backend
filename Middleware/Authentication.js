
const jwt=require("jsonwebtoken");
const CustomError = require("../utils/customError")

// const userAuthMiddleware = async (req, res, next) => {
//     try {
//         const token = req.headers['authorization'];

//         // Check if the token is present
//         if (!token) {
//             return res.status(401).send("Authentication token missing");
//         }

//         // Remove "Bearer " from the token if present
//         const tokenWithoutBearer = token.replace("Bearer ", "");

//         console.log("Token without Bearer:", tokenWithoutBearer);

//         // Verify the token
//         jwt.verify(tokenWithoutBearer, process.env.JWT_TOKEN, (err, user) => {
//             if (err) {
//                 console.error("Token verification error:", err.message); // Log error message
//                 return res.status(403).send("Invalid token"); // Send appropriate status
//             }
//             // If verification is successful, set the user info on the request object
//             req.user = user;
//             console.log('Authenticated user:', req.user);
//             next(); // Proceed to the next middleware or route handler
//         });
//     } catch (error) {
//         console.error("Middleware error:", error.message); // Log unexpected errors
//         return res.status(500).send("Server error"); // Send generic error response
//     }
// };
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
      console.log("nihaladmin",admintoken)
     if(!admintoken){
      return res.status(401).json({message:" admin Authentication token missing"});
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