const jwt=require("jsonwebtoken");
const refreshAccessToken=async(req,res)=>{
    const refreshToken= req.cookies.refreshToken
    if(!refreshToken){
       return res.status(404).send("refresh token missing")
    }
    jwt.verify(refreshToken,process.env.JWT_TOKEN,(error,user)=>{
        if(error){
            return res.status(403).send("Refresh token is invalid");
        }

const accessToken=jwt.sign(
    {id:user.id,username:user.username,email:user.email},
    process.env.JWT_TOKEN,
    { expiresIn: "30m" } 
)
res.cookie('token', accessToken, {
    httpOnly: true,    
    secure: true,      
    maxAge:  1 * 60 * 1000,
    sameSite: 'lax',   
});

res.status(200).json({ accessToken: accessToken });
        
    })

}


module.exports={refreshAccessToken}