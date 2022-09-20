const jwt=require("jsonwebtoken")
const fetchuser=(req,res,next)=>{
//Get the user from the JWT token and id to request object 
const token=req.header('auth-token');
const JWT_SCRET="GOVINDisGOODboy"
if(!token){
    res.status(401).send({error:"Please authenticate using a valid token"})
}
try{
    const data =jwt.verify(token,JWT_SCRET);
    req.user=data.user;
    next();

}catch(error){
    res.status(401).send({error:"Please authenticate using a valid token"})
}
}
module.exports=fetchuser;