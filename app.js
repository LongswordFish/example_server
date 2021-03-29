const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session')

//This loads all our environment variables from the keys.env
require("dotenv").config({path:'./config/keys.env'});

//import your router objects
const userRoutes = require("./controllers/User");
const taskRoutes = require("./controllers/Task");
const generalRoutes = require("./controllers/General");

//creation of app object
const app = express();

//bodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));

//express static middleware
app.use(express.static("public"));


//Handlebars middlware
app.engine("handlebars",exphbs(

    {
        helpers:{
            if_priority_low:function(priority){
                if(priority==="low")
                    return "selected";
            },
            if_priority_medium:function(priority){
                if(priority==="medium")
                    return "selected";
            },
            if_priority_high:function(priority){
                if(priority==="high")
                    return "selected";
            }
        }

    }

));
app.set("view engine","handlebars");

//this is to allow specific forms and links that were submitted to send PUT and DELETE request respectively
app.use((req,res,next)=>{
    if(req.query.method==='PUT'){
        req.method="PUT";
    }
    else if(req.query.method==="DELETE"){
        req.method="DELETE";
    }
    next();
})


// default options
app.use(fileUpload());


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: `${process.env.SECRET_KEY}`,
  resave: false,
  saveUninitialized: true
}))

app.use((req,res,next)=>{
    res.locals.user=req.session.userInfo;
    console.log(`res.locals.user is ${res.locals.user}`);
    next();
})

//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/task",taskRoutes);
app.use("/",(req,res)=>{
    res.render("General/404");
});


mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log(`Connected to MongoDB database`)})
.catch(error=>console.log(`Errors when trying to connect to mongoBD because of ${error}`))

const PORT = process.env.PORT;
//Creates an Express Web Server that listens for incomin HTTP Requests
app.listen(PORT,()=>{
    console.log(`Your Web Server has been connected at port ${PORT}`);
    
});



