
/*********************Task ROUTES***************************/
const express = require('express')
const router = express.Router();
const taskModel=require('../models/Task');
const moment=require('moment');
const isLoggedIn=require('../middleware/auth');
const isAdmin=require('../middleware/authentication')


//Route to direct use to Add Task form
router.get("/add",(req,res)=>
{
    res.render("Task/taskAddForm");
});

//Route to process user's request and data when the user submits the add task form
router.post("/add",(req,res)=>
{
    const {title,description, dueDate,priority}=req.body;
    const newObj={
        title,
        description,
        dueDate,
        priority
    };

    const task=new taskModel(newObj);
    task.save()
    .then(()=>{
        res.redirect('list');
    })
    .catch(error=>console.log(`Error during inserting into database: ${error}`))
   
});

////Route to fetch all tasks
router.get("/list",isLoggedIn,(req,res)=>
{
    taskModel.find()
    .then((tasks)=>{
        const filteredTasks=tasks.map((task)=>{
            const {_id,title,description,dueDate,status,priority}=task;
            return {
                _id,
                title,
                description,
                dueDate:moment(dueDate).format('YYYY-MM-DD'),
                status,
                priority
            }
        });

        res.render("task/taskDashboard",{
            data:filteredTasks
        });
    })
    .catch(error=>console.log(`Error during reading from database: ${error}`))

  
});

//Route to direct user to the task profile page
router.get("/description",(req,res)=>{

    

})


//Route to direct user to edit task form

router.get("/edit/:_id",(req,res)=>{

    
    taskModel.findById(req.params._id)
    .then((task)=>{
        const {_id,title,description,dueDate,status,priority}=task;

        res.render("Task/taskEditForm",{
            _id,
            title,
            description,
            dueDate:moment(dueDate).format('YYYY-MM-DD'),
            status,
            priority

        })
    })
    .catch(error=>console.log(`Error during reading one document from database: ${error}`))

});

//Route to update user data after they submit the form
router.put("/update/:_id",(req,res)=>{
    const {title,description,priority,dueDate,status}=req.body;
    const task={
        title,
        description,
        priority,
        dueDate,
        status 
    };

    taskModel.updateOne({_id:req.params._id},task)
    .then(()=>{
        res.redirect("/task/list");
    })
    .catch(error=>console.log(`Error during updating one document from database: ${error}`));

})

//router to delete user
router.delete("/delete/:_id",(req,res)=>{
    taskModel.deleteOne({_id:req.params._id})
    .then(()=>{
        res.redirect("/task/list");
    })
    .catch(error=>console.log(`Error during deleting one document from database: ${error}`));

});

module.exports=router;