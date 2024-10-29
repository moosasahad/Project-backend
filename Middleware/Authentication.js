// const jwt = require("jsonwebtoken")
// const CustomError = require('../utils/customError')

// const userAuthMiddleware = async (req,res,next)=>{
//     const authheader = req.headers["authorization"];
//     const token = authheader && authheader.split(' ')[1]||req.cookies.token 

//     if(!token){
//         const refreshtoken = req.Cookies?.refreshtoken;

//         if (!refreshtoken) {
//             return next(new CustomError('No token or refresh token', 403));
//         }
//         try{
//             const decoded = jwt.varify(refreshtoken, process.env.JWT_REFRESH_KEY)
//         }
//     }

// }

const jwt=require("jsonwebtoken");

const userAuthMiddleware = async (req, res, next) => {
    try {
      // console.log(res.cookie.token)
      // const authHeader = req.headers['authorization'];
        
      //   const token = authHeader && authHeader.split(' ')[1]
      const token=req.cookies.token
      console.log(token)
     if(!token){
      return res.status(401).send("Authentication token missing");
     }
        
        if (token) {
          jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
            
            if(err){
                res.send(err)
            }else{
                req.user=user
                console.log(req.user);
                
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
    


module.exports={userAuthMiddleware}