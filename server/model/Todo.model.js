const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    Title:{
        type:String,
        require:true
    },
    Discription:{
        type:String,
        require:true
    },
},{timestamps:true})

const Todo = mongoose.model("todo", todoSchema);
module.exports={Todo};