/**
 * @author [Muhammad Daffa Ilhami]
 * @email [mdaffailhami@gmail.com]
 * @create date 2021-02-16 | 09:11:01
 * @modify date 2021-02-20 | 09:19:35
 * @desc [Aplikasi Web untuk menyimpan catatan secara online]
 */

require("dotenv").config();

const express = require("express");
const session = require("express-session");

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

// Handling static file
app.get("/file", (req, res) => {
  res.sendFile(__dirname + "/" + req.query.path);
});

// Router
app.use(require("./pages/login/router.js"));
app.use(require("./pages/register/router.js"));

app.use((req, res, next) => {
  // Cek jika session user tidak ada
  if (req.session["user"] == undefined) {
    res.redirect("/login");
  } else {
    next();
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
