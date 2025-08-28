const mongoose = require("mongoose");

const databaseCollection=async()=>{
    await mongoose.connect("mongodb+srv://dhruvinnaik3109:nxc25ZljkjA1xdxQ@cluster0.k2cca6d.mongodb.net/school?retryWrites=true&w=majority")
    .then(()=>{console.log("Connected with mongoDB databse")})
    .catch((err)=>{console.log("Connection Failed", err)})
}

module.exports={databaseCollection};