const express = require("express");
const { handleNoteController, handleNoteListController, handleNoteDeleteController, handleNoteUpdateController } = require("../controller/note.controller");

const route= express.Router();

route.post("/add", handleNoteController);
route.get("/Notelist",handleNoteListController);
route.post("/delete",handleNoteDeleteController);
route.put("/update",handleNoteUpdateController);
module.exports={route};