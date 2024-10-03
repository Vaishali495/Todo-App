const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoSchema = new Schema({
    task:{
        type:String,
        trim:true,
        required:true,
    },
    isCompleted:{
        type:Boolean,
        default:false,
    },
});

const task = mongoose.model('task',todoSchema);
module.exports = task;