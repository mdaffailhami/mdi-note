/**
 * @author [Muhammad Daffa Ilhami]
 * @email [mdaffailhami@gmail.com]
 * @create date 2021-02-16 | 09:11:01
 * @modify date 2021-02-24 | 21:44:47
 * @desc [Aplikasi Web untuk menyimpan catatan secara online]
 */

require("dotenv").config();

const database = require("./databases/mdi-note.js");
const bcrypt = require("bcrypt");
const express = require("express");
const session = require("express-session");
const cookie = require("cookie-parser");

const app = express();

app.use((req, res, next) => {
  // Ketika aplikasinya sudah berstatus production
  if (process.env.APP_STATUS == "production") {
    // Jika http maka auto redirect ke https
    if (req.headers["x-forwarded-proto"] != "https") {
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  }
  next();
});

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

// Cookie
app.use(cookie());

// Handling static file
app.get("/file", (req, res) => {
  res.sendFile(__dirname + "/" + req.query.path);
});
console.log(new Date());
// Router
app.use(require("./pages/login/router.js"));
app.use(require("./pages/register/router.js"));

// Cek cookie dan session login
app.use((req, res, next) => {
  // Cek jika cookie login ada
  if (req.cookies["lol"] != undefined) {
    database.Account.findById(req.cookies["lol"], (err, doc) => {
      if (err) {
        res.redirect("/login");
        return;
      }

      req.session["user"] = doc["email"];
      next();
    });
  }

  // Cek jika session login ada
  else if (req.session["user"] != undefined) {
    next();
  }

  // Jika cookie maupun session tidak ada dua-duanya
  else {
    res.redirect("/login");
  }
});

app.use(require("./pages/index/router.js"));
app.use(require("./pages/create/router.js"));
app.use(require("./pages/update/router.js"));
app.use(require("./pages/api/note/router.js"));
// app.use(require("./pages/profile/router.js"));

// Not found page
app.get("*", (req, res) => {
  res.redirect("/");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("App is running on port", port));
