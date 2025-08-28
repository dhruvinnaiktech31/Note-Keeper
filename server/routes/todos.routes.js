const express = require("express");
const { handleTodoController, handleTodoListController, handleTodoDeleteController, handleTodoUpdateController } = require("../controller/todo.controller");

const routes= express.Router();

routes.post("/todoadd", handleTodoController);
routes.get("/todolist",handleTodoListController);
routes.post("/tododelete",handleTodoDeleteController);
routes.put("/todoupdate",handleTodoUpdateController);
module.exports={routes};