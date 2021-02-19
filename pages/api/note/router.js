const database = require("../../../databases/mdi-note.js");
const express = require("express");

const router = express.Router();

router.get("/api/note", (req, res) => {
  database.Note.find({ user: req.session.user }, (err, docs) => {
    if (err) throw err;
    // Jika keyword-nya kosong
    let notes = docs;

    // Jika keyword-nya TIDAK kosong
    if (req.query["keyword"].length > 0) {
      notes = [];
      for (let i = 0; i < docs.length; i++) {
        if (docs[i]["title"].toUpperCase().includes(req.query["keyword"].toUpperCase())) {
          notes.push(docs[i]);
        }
      }
    }

    res.json({ status: "success", notes });
  });
});

router.delete("/api/note/:_id", (req, res) => {
  database.Note.findByIdAndDelete(req.params["_id"], (err, doc) => {
    if (err) throw err;
    console.log("\nDELETE:\n", doc);

    res.json({ status: "success" });
  });
});

module.exports = router;
