const express = require('express')
const router = express.Router();

/*GENERAL ROUTES*/
//Route to direct user to home page
router.get("/",(req,res)=>
{
    res.render("General/index");
});


//Route to direct user to about us page
router.get("/about",(req,res)=>
{
    res.render("General/about");
});

module.exports=router;