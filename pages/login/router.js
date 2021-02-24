const querystring = require("querystring");
const database = require("../../databases/mdi-note.js");
const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render(`${__dirname}/login.ejs`);
});

router.post("/login", (req, res) => {
  req.on("data", (chunk) => {
    const data = querystring.parse(String(chunk));

    database.Account.findOne({ email: data.email }, (err, doc) => {
      if (err) throw err;

      // Cek jika akun tidak terdaftar atau password salah
      if (doc == null || !bcrypt.compareSync(data.password, doc.password)) {
        res.send(
          `<script>
          alert("Incorrect email or password!!!");
          document.location.href = "/login";
          </script>`
        );
        return;
      }

      console.log("\nLOGIN:\n", doc);

      if (data["remember_me"] == "on") {
        res.cookie("lol", doc["_id"], { maxAge: 123456789100 });
      }
      req.session["user"] = doc["email"];

      res.redirect("/");
    });
  });
});

module.exports = router;
