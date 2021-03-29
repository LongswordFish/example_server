var mongoose = require('mongoose');
var Schema=mongoose.Schema;

const taskSchema = new Schema({

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },
    priority:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"open"
    },
    dateCreated:{
        type:Date,
        default:Date.now()
    },
    createdBy:{

    }
});

const taskModel=mongoose.model('Task',taskSchema);
module.exports=taskModel;