const express = require("express");
const session = require("express-session");
const database = require("../../databases/mdi-note.js");

const router = express.Router();

router.get("/", (req, res) => {
  // Cek jika session user tidak ada
  if (req.session["user"] == undefined) {
    res.redirect("/login");
    return;
  }

  res.render(`${__dirname}/index.ejs`, {
    userEmail: req.session.user,
  });
});

router.get("/delete/:_id", (req, res) => {
  // Cek jika session user tidak ada
  if (req.session["user"] == undefined) {
    res.redirect("/login");
    return;
  }

  database.Note.findByIdAndDelete(req.params["_id"], (err, doc) => {
    if (err) throw err;
    console.log("\nDELETE:\n", doc);

    res.redirect("/");
  });
});

router.get("/search", (req, res) => {
  // Cek jika session user tidak ada
  if (req.session["user"] == undefined) {
    res.redirect("/login");
    return;
  }

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

    res.render(`${__dirname}/xhr/note-list.ejs`, {
      notes,
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
