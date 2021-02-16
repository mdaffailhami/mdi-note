const express = require("express");
const database = require("../../databases/mdi-note.js");

const router = express.Router();

router.get("/", (req, res) => {
  // Cek jika session user tidak ada
  if (req.session["user"] == undefined) {
    res.redirect("/login");
    return;
  }

  // Cari semua note-nya si user
  database.Note.find((err, docs) => {
    if (err) throw err;

    res.render(`${__dirname}/index.ejs`, {
      notes: docs,
    });
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

module.exports = router;
