const isAdmin=(req,res,next)=>{
    if(req.session.userInfo.userType=="admin"){
        res.redirect("/user/admin");
    }
    else{
        next();
    }
}

module.exports=isAdmin;