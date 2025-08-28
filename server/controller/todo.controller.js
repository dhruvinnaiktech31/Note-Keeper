const {Todo} = require("../model/Todo.model");



const handleTodoController = async (req, res) => {
  try {
    const body = req.body;
    if (!body.Title || !body.Discription) {
      return res
        .status(400)
        .json({ Message: "All Fields Are Required", Success: false });
    }

    const addTodo = await Todo.create(body);

    return res.status(201).json({
      Message: "Successfully added",
      Success: true,
      Id: addTodo._id,
      Todo: addTodo,
    });
  } catch (err) {
    return res.status(400).json({ Message: err.message, Success: false });
  }
};


const handleTodoListController= async(req, res)=>{
    try{
       const todoList = await Todo.find({});
          return res.status(201)
        .json({Message:"Todo List Found", Success:true, Todolist:todoList})
    }
    catch(err){
        return res.status(400)
        .json({Message:err.Message, Success:false})

    }
}

const handleTodoDeleteController= async(req, res)=>{
  const body = req.body;
    try {
        const deleted = await Todo.deleteOne({_id:body.Id});
        if(deleted.acknowledged){
             return res.status(200)
            .json({Message:"Todo Deleted Successfully", Success:true});
        }
    } catch (error) {
         return res.status(400)
.json({Message:error.Message, Success:false});
    }
}

const handleTodoUpdateController= async(req, res)=>{
  const body = req.body;
    try {
        const updated = await Todo.updateOne({_id:body.Id},{$set:body});
        if(updated.acknowledged){
             return res.status(200)
            .json({Message:"Todo updated Successfully", Success:true});
        }
    } catch (error) {
         return res.status(400)
.json({Message:error.Message, Success:false});
    }
}


module.exports={handleTodoController, handleTodoListController, handleTodoDeleteController, handleTodoUpdateController}