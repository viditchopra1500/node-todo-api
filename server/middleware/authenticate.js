var {User}=require('./../models/user');

//so we created a middleware which only runs when its in the arguments of the route(ie all private routes)
//so its work is to authenticate/verify the token and sends(imp point) the corresponding user attached with the req.
var autheticate=(req,res,next)=>{
    //user will pass the token as a header
    var token=req.header('x-auth');

    User.findByToken(token).then((user)=>{
        //ie token is valid but no such user is found
        if(!user){
            return Promise.reject();
        }
        req.user=user;
        req.token=token;
        next();
    }).catch((e)=>{
        res.status(401).send(e); 
    })
}

module.exports={autheticate};