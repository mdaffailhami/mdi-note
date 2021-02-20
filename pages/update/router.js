const querystring = require("querystring");
const express = require("express");
const database = require("../../databases/mdi-note.js");

const router = express.Router();

router.get("/update/:_id", (req, res) => {
  // Cari Note yg ingin user edit
  database.Note.findById(req.params["_id"], (err, doc) => {
    if (err) throw err;

    res.render(`${__dirname}/update.ejs`, {
      note: doc,
    });
  });
});

module.exports = router;
