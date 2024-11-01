
const jwt=require("jsonwebtoken");

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
    // const adminAuthMiddleware
    


module.exports={userAuthMiddleware}