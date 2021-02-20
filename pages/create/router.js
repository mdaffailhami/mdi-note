const querystring = require("querystring");
const database = require("../../databases/mdi-note.js");
const express = require("express");

const router = express.Router();

router.get("/create", (req, res) => {
  // Cek jika session user tidak ada
  if (req.session["user"] == undefined) {
    res.redirect("/login");
    return;
  }

  res.render(`${__dirname}/create.ejs`);
});

module.exports = router;
