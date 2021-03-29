/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();
const userModel=require('../models/User');
const path=require('path');
const bcrypt=require('bcryptjs');
const isLoggedIn=require('../middleware/auth');
const isAdmin=require('../middleware/authentication')


//Route to direct use to Registration form
router.get("/register",(req,res)=>
{
    console.log('get--register');
    res.render("User/register");
});

//Route to process user's request and data when user submits registration form
//using async and await
router.post("/register",async (req,res)=>
{ 
    console.log('post--register');
    //get the variables from the re.body
    const{firstName,lastName,email,password,cpassword}=req.body;

    //build a new userObject
    const newUser={
        firstName,
        lastName,
        email,
        password,
    };

    //build a new modeled userobject using the userObejct
    const user=new userModel(newUser);

    try{
        //save the new modeled userobject 
        let returnUser = await user.save();
        console.log('add user accomplished');

        //create a new variable "fileName" used for update
        var fileName="";
        
        //if the user uploaded a file
        if(req.files){
            //change the fileName= pro_pic+id+extention
            fileName=`pro_pic_${returnUser._id}${path.parse(req.files.profilePic.name).ext}`;
            //move the file to the public/uploads directory of the server and rename it
            req.files.profilePic.mv(`public/uploads/${fileName}`)
        }
        // if the user didn't upload a file
        else{
            fileName="sys_default.jpg";
        }
        // update the profilePic attribute data of the users who has the same _id
        // note: ** model.updateOne return how many document been modified
        // not a user object
        await userModel.updateOne({_id:returnUser._id},{profilePic:fileName});

        // get the user object with the profilePic
        const returnUser2= await userModel.findOne({_id:returnUser._id});
        console.log(returnUser2);

        //set req.session.userInfo
        req.session.userInfo=returnUser2;

        //redirect
        res.redirect(`/user/profile`);

        // also this works too. we can simply set the profilePic attribute manually
        // returnUser["profilePic"]=fileName;
        // req.session.userInfo=returnUser;
        // res.redirect(`/user/profile`);


        // this doesn't work either. So I think we need to get the user again
        // userModel.updateOne({_id:returnUser._id},{profilePic:fileName})
        // .then(()=>{
        //     console.log(returnUser);
        //     req.session.userInfo=returnUser;
        //     res.redirect(`/user/profile`);
        // })

    }
    catch(error){
        console.log(` ${error}`);
    }

    //using promises
    // user.save()
    // .then((user)=>{
    //     console.log('add user accomplished');
    //     const{_id}=user;
    //     req.files.profilePic.name=`pro_pic_${_id}${path.parse(req.files.profilePic.name).ext}`;
    //     console.log(req.files.profilePic.name);
    //     req.files.profilePic.mv(`public/uploads/${req.files.profilePic.name}`)
    //     .then((result)=>{
    //         userModel.updateOne({_id:_id},{profilePic:req.files.profilePic.name})
    //         .then((result)=>{
    //             console.log("profile uploaded succesfully!");
    //             res.redirect(`/user/profile/${_id}`);
    //         })
    //         .catch()
    //     })
    //     .catch()
    // })
    // .catch(
    //     error=>console.log(`Error during inserting new user into database: ${error}`)
    // )


});

//Route to direct user to the login form
router.get("/login",(req,res)=>
{
    console.log("get--login");
    res.render("User/login");
});

//Route to process user's request and data when user submits login form
//using async and await
router.post("/login",async (req,res)=>
{
    try{
        const user = await userModel.findOne({email:req.body.email});
        let error_1 = "";
        let error_2 = "";
        if (user == null) {
            error_1 = "Sorry, the email has not been registered";
            res.render("User/login", {
                error_1,
            })
        }
        else {
            const isMatched = await bcrypt.compare(req.body.password, user.password);
            if (isMatched) {
                req.session.userInfo = user;
                res.redirect(`/user/profile`);
            }
            else {
                error_2 = "The password doesn't match!";
                res.render("User/login", {
                    error_2,
                });
            }
        }
    }
    catch(error){
        console.log(`error happened during login because of ${error}`);
    }

});

//using promises 
// router.post("/login",(req,res)=>
// {
//     userModel.findOne({email:req.body.email})
//     .then(user=>{
//         let error_1="";
//         let error_2="";
//         if(user==null){
//             error_1="Sorry, the email has not been registered";
//             res.render("User/login",{
//                 error_1,
//             })
//         }
//         else{
//             bcrypt.compare(req.body.password, user.password)
//             .then(isMatched=>{
//                 if(isMatched){
//                     req.session.userInfo=user;
//                     res.redirect(`/user/profile`);
//                 }
//                 else{
//                     error_2="The password doesn't match!";
//                     res.render("User/login",{
//                         error_2,
//                     });
//                 }
//             })
//             .catch()
//         }
//     })
//     .catch()
// });


router.get("/profile",isLoggedIn,isAdmin,(req,res)=>{
    res.render("User/userDashboard");   
});

router.get("/admin",isLoggedIn,(req,res)=>{
    res.render("User/adminDashboard");   
});

router.get("/logout",(req,res)=>{
    req.session.destroy(); 
    res.redirect("/");
});

module.exports=router;