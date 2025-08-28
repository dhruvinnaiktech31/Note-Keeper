const {Note} = require("../model/Note.model");



const handleNoteController = async (req, res) => {
  try {
    const body = req.body;
    if (!body.Title || !body.Discription) {
      return res
        .status(400)
        .json({ Message: "All Fields Are Required", Success: false });
    }

    const addNote = await Note.create(body);

    return res.status(201).json({
      Message: "Successfully added",
      Success: true,
      Id: addNote._id,
      Note: addNote,
    });
  } catch (err) {
    return res.status(400).json({ Message: err.message, Success: false });
  }
};


const handleNoteListController= async(req, res)=>{
    try{
       const noteList = await Note.find({});
          return res.status(201)
        .json({Message:"Note List Found", Success:true, Notelist:noteList})
    }
    catch(err){
        return res.status(400)
        .json({Message:err.Message, Success:false})

    }
}

const handleNoteDeleteController= async(req, res)=>{
  const body = req.body;
    try {
        const deleted = await Note.deleteOne({_id:body.Id});
        if(deleted.acknowledged){
             return res.status(200)
            .json({Message:"Note Deleted Successfully", Success:true});
        }
    } catch (error) {
         return res.status(400)
.json({Message:error.Message, Success:false});
    }
}

const handleNoteUpdateController= async(req, res)=>{
  const body = req.body;
    try {
        const updated = await Note.updateOne({_id:body.Id},{$set:body});
        if(updated.acknowledged){
             return res.status(200)
            .json({Message:"Note updated Successfully", Success:true});
        }
    } catch (error) {
         return res.status(400)
.json({Message:error.Message, Success:false});
    }
}


module.exports={handleNoteController, handleNoteListController, handleNoteDeleteController, handleNoteUpdateController}