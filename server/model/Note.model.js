const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    Title:{
        type:String,
        require:true
    },
    Discription:{
        type:String,
        require:true
    },
},{timestamps:true})

const Note = mongoose.model("notes", noteSchema);
module.exports={Note};