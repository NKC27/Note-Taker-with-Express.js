// dependencies 
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const PORT = process.env.PORT || 3001;

//
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Display
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    })
});

//New Note
app.post("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuid.v4();
        notes.push(newNote);

        const createNote = JSON.stringify(notes);
        fs.writeFile(path.join(__dirname, "./db/db.json"), createNote, (err) =>{
            if (err) throw err;
        });
        res.json(newNote);
    });
});

//Delete stored notes
app.delete("/api/notes/:id", function(req, res) {
    const id = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const notesArray = notes.filter(item => {
            return item.id !== id
        });
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err, data) => {
            console.log("Deleteled")
            if (err) throw err; 
            res.json(notesArray) 

        });
    });

});

// start server
app.listen(PORT, function() {
    console.log(`App listening to ${PORT}`);
});