const asynchandler=require("express-async-handler");
const jwt=require("jsonwebtoken");

const validatetoken=asynchandler(async(req,res,next)=>
{
    let token;
    const authheader=req.headers.authorization||req.headers.Authorization;
    const username=req.headers.username||req.headers.Username;
    if(authheader&&authheader.startsWith("Bearer"))
    {
    token=authheader.split(" ")[1];
    await jwt.verify(token,process.env.ACC_TOKEN,(err,decoded)=>
    { if(token){
        if(err)
        {
            res.status(401).send("User not authorized");
         
        }
        else{
        if(decoded.user.username!==username)
            {
            res.status(401).send("User not authorized");
        return;
            }
        req.user=decoded.user;
        
        console.log(decoded);
        next();
        }
        
    }});
    }
    if(!token)
    {
        res.status(401).send("User not authorized");
        
    }

});
module.exports=validatetoken;