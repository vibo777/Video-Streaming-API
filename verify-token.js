function verifyToken(req,res,next){

    if(req.headers.authorization!=undefined){
        let token = req.headers.authorization.spilt(" ")[1];
        jwt.verify(token,"secretkey",(err,userCred)=>{

            if(err===null){
                next();
            }
            else{
                res.status(401).send({message:"Invalid Token"});
            }

        })   
    }
    else{
        res.status(403).send({message:"Please Auhtenticate yourself"})
    }
}

module.exports = verifyToken;
