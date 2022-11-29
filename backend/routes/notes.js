const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const router = express.Router();
const {body, validationResult } = require('express-validator');

// Route1 -> login requierd
router.get('/fetchallnotes' , fetchuser, async (req ,res)=>{
    try {
        const notes = await Note.find({user : req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occured");
    }
})

//Route2 -> using post
router.post('/addnote' , fetchuser , [ 
    body('title','Enter a valid name').isLength({min : 3}),
    body('description','description must be atleast 5 characters').isLength({min : 5}),
], async (req ,res)=>{
    try {
    
        //if there are errors return the bad request and erors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }

        const {title,description,tag} = req.body;
        const note = new Note({
            title , description , tag,user : req.user.id  
        })
        const savednote = await note.save();
        res.json(savednote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occured");
    }

})

//Route -> 3 updating the note
router.put('/updatenote/:id' , fetchuser, async (req ,res)=>{
    try {
        
        const {title,description,tag} = req.body;

        //create a new note object
        const newnote = {};
        if(title){newnote.title = title};
        if(description){newnote.description = description};        
        if(tag){newnote.tag = tag};        

        //find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){ return res.status(404).send("Not Found") }
        if(note.user.toString() !== req.user.id){ return res.status(401).send("Not Allowed") } 

        note = await Note.findByIdAndUpdate(req.params.id , {$set: newnote},{new:true});
        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occured");
    }
})

//Route -> 4 Deleting the note
router.delete('/deletenote/:id' , fetchuser, async (req ,res)=>{

        try {
            
            //find the note to be delete and delete it
            let note = await Note.findById(req.params.id);
            if(!note){ return res.status(404).send("Not Found") }
            if(note.user.toString() !== req.user.id){ return res.status(401).send("Not Allowed") } 
    
            note = await Note.findByIdAndDelete(req.params.id);
            res.json({"Success" : "Nte has been deleted" , note : note});

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal error occured");
        }

})

module.exports = router