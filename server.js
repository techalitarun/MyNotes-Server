const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());



mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

const noteSchema = new mongoose.Schema({
    title:String,
    content:String,
    type:String
});

const Note = mongoose.model("Note",noteSchema);

app.post("/api",async function(req,res){
    console.log(req.body);
    if(Object.keys(req.body).length === 0)
    {
        Note.find()
        .then(function(presentNotes){
            res.status(200).json(presentNotes);
        })
        .catch(function(err){
            console.log(err);
        });
    }
    else{
        const note = new Note({
            title: req.body.title,
            content: req.body.content,
            type: req.body.type
        });
        await note.save();
    
        await Note.find()
        .then(function(allNotes){
            console.log(allNotes);
            res.status(200).json(allNotes);
        })
        .catch(function(err){
            console.log(err);
        });
    }
});

app.route("/api/:id")
.get(function(req,res){
    console.log(req.params.id);
})
.patch(async function(req,res){
    await Note.updateOne({_id:req.params.id},{$set:req.body});
    
    await Note.find()
    .then(function(allNotes){
        console.log(allNotes);
        res.status(200).json(allNotes);
    })
    .catch(function(err){
        console.log(err);
    });
})
.delete(async function(req,res){
    console.log(req.params.id);
    await Note.deleteOne({_id:req.params.id});

    await Note.find()
    .then(function(allNotes){
        console.log(allNotes);
        res.status(200).json(allNotes);
    })
    .catch(function(err){
        console.log(err);
    });
});






app.listen(process.env.PORT || 5000,function(){
    console.log("server running at 5000");
});

