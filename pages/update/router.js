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

router.post("/update/:_id", (req, res) => {
  req.on("data", (chunk) => {
    const data = querystring.parse(String(chunk));

    database.Note.findByIdAndUpdate(
      req.params["_id"],
      {
        title: data["title"],
        content: data["content"],
        __v: Number(data["__v"]) + 1,
      },
      (err, doc) => {
        if (err) throw err;
        console.log("\nUPDATE:", doc);

        res.redirect("/");
      }
    );
  });
});

module.exports = router;
