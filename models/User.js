var mongoose = require('mongoose');
var Schema=mongoose.Schema;
const bcrypt=require('bcryptjs');

const userSchema = new Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },  
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String
    },
    dateCreated:{
        type:Date,
        default:Date.now()
    },
    userType:{
        type:String,
        default:"user"
    },
    createdBy:{

    }
});

userSchema.pre('save',function(next){
    bcrypt.genSalt(10)
    .then((salt)=>{
	    bcrypt.hash(this.password,salt)
	    .then((encryptedPassword)=>{
	    this.password=encryptedPassword;
	    next();
	    })  
	    .catch()
    })
    .catch()
});


const userModel=mongoose.model('User',userSchema);
module.exports=userModel;