const express = require("express");
const router = express.Router();
const Notes = require("../modules/Notes");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../midlleware/fetchuser");
//Route 1:=> Get all the Notes uinsg GET "/api/notes/fetchnotes"
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});

//Route 2:=> To add the Notes uinsg POST "/api/notes/addnote
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid Titel").isLength({ min: 3 }),
    body("description", " Description must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      // if there are errors, return Bad request and the erros
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//Route 3:=> Update  the existing  Notes uinsg PUT "/api/notes/updatenote  {we have to know the id of that note}
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    try{
        const {title,description,tag}=req.body
    // Create new note object 
        const newnote={};
        if(title){newnote.title=title};
        if(description){newnote.description=description};
        if(tag){newnote.tag=tag};

        //Find the note to be updated and update it 
        let note= await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Note not found")}

        //to check the valid user to edit the notes
        if(note.user.toString()!==req.user.id)//we check the id by toString method
        {
            return res.status(404).send("Not allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})//new:= true it will create the new content
        res.json({note}) 
    }catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }

})


//Route :4:=> Deleting the note using DELETE "/app/notes/deletenote"
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try{
        
    
        //Find the note to be deleted  and delete it 
        let note= await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Note not found")}

        //Allow deletion only if user owns this note
        if(note.user.toString()!==req.user.id)//we check the id by toString method
        {
            return res.status(404).send("Not allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)//new:= true it will create the new content
        res.json({"Success":"note has been delted",note:note}); 
    }catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }

})
module.exports = router;
