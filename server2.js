//Todo backend using mongoDB

const express = require("express");
const app = express();
const PORT = 4000;
const ejs = require("ejs");
const task = require("./todoModel.js");
const mongoose = require('mongoose');

app.use(express.json());              //use to convert strigify data to JSON
app.use(express.static("./public"));  //serve all static files from the public directory
app.set("view engine", "ejs");        //Express will automatically look for .ejs files in the views directory 

//connect the mongoDB to vs
mongoose.connect('mongodb://localhost:27017/TaskData')
.then(() => console.log("Database connected"))
.catch((err) => console.log("error in connecting",err));

//route to handle render page
app.get('/',async (req,res) => {
    try{
        let tasks = await task.find({}) //fetch all tasks
        res.render("indexEjs",{tasks: tasks});
    }
    catch(err){
        console.error("Error in home route = ",err);
    }
});

//route to handle add the task to the database
app.post('/addtask',async (req,res) => {
    try{
        let newTask = req.body; 
        const addTask = await task.insertMany(newTask);
        //to render on browser
        ejs.renderFile("./views/taskPartial.ejs",{ text: newTask },function (err, str) {
              if (err) {
                console.error(err);
                return;
              }
              res.json({ success: true, htmlData: str });
            }
        );
    }
    catch(err){
        console.error('Error in addTask: ',err);
    }
})

//route to handle delete the task from databse
app.delete('/deleteTask/:id',async (req,res) => {
    try{
        let taskId = req.params.id;
        let deleteTask = await task.deleteMany({_id: taskId});
        res.json({success: true});
    }
    catch(err){
        console.error("Error in deleteTask: ",err);
    }
})

//route to edit the task
app.patch("/editTask/:id",async (req,res) => {
    try{
        let editData = req.body.task;
        let taskId = req.params.id;
        let editTask = await task.updateOne({_id: taskId},{ $set: { task: editData } });
        res.json({success: true});
    }
    catch(err){
        console.error('Error in editTask: ',err);
    }
})

// route to handle the checkBox
app.patch('/checkBox/:id',async (req,res) => {
    try{
        let taskId = req.params.id;
        let status = req.body.isCompleted;
        let editStatus = await task.updateOne({_id: taskId},{$set: {isCompleted: status}});
        res.json({success: true});
    }
    catch(err){
        console.error('Error in checkBox: ',err);
    }
})

// app.patch('/checkBox/:id', async (req, res) => {
//     try {
//         let taskId = req.params.id;

//         // Check if taskId is a valid ObjectId
//         if (!mongoose.Types.ObjectId.isValid(taskId)) {
//             return res.status(400).json({ success: false, message: "Invalid Task ID" });
//         }

//         let status = req.body.isCompleted;
        
//         // Update the task's status
//         let editStatus = await task.updateOne({ _id: mongoose.Types.ObjectId(taskId) }, { $set: { isCompleted: status } });

//         res.json({ success: true });
//     } catch (err) {
//         console.error('Error in checkBox: ', err);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

app.listen(PORT, () => {
   console.log("Server started on",PORT);
});