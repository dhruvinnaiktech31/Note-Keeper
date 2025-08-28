const express = require("express");
const { databaseCollection } = require("./dabaseCollection");
const { route } = require("./routes/notess.route");
const { routes } = require("./routes/todos.routes");
const cors = require("cors");
const app = express();

//call database
databaseCollection();
app.use(cors())
app.use(express.json());  //because we will use data as json format 
app.get("/", (req, res)=>{
    res.send("Hellow World")
})

app.use("/note", route);
app.use("/todo", routes);
app.listen(8000, ()=>{
    console.log("App is running on 8000");
})