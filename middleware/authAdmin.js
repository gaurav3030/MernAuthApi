
const jwt = require("jsonwebtoken");

const auth = (req, res, next) =>{
    try{
        const token = req.header("x-auth-admin-token");
        if(!token){
            return res.status(401).json({msg: "no authentication token , autherization denied"});
        }
        const verified = jwt.verify(token, process.env.JWT_TOKEN);
        if(!verified){
            return res.status(401).json({msg: "token verification failed , autherization denied"});
        }
        req.admin = verified.id;
        next();
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
    
};
module.exports=auth;