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

router.post("/create", (req, res) => {
  req.on("data", (chunk) => {
    const data = querystring.parse(String(chunk));

    database.Note.create(
      {
        user: req.session["user"],
        title: data["title"],
        content: data["content"],
      },
      (err, doc) => {
        if (err) throw err;
        console.log("\nCREATE:\n", doc);

        res.redirect("/");
      }
    );
  });
});

module.exports = router;
