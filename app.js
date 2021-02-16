/**
 * @author [Muhammad Daffa Ilhami]
 * @email [mdaffailhami@gmail.com]
 * @create date 2021-02-16 | 09:11:01
 * @modify date 2021-02-16 | 21:24:08
 * @desc [Aplikasi Web untuk menyimpan catatan secara online]
 */
require("dotenv").config();
const express = require("express");
const session = require("express-session");

const app = express();

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
app.use(require("./pages/index/router.js"));
app.use(require("./pages/login/router.js"));
app.use(require("./pages/register/router.js"));
app.use(require("./pages/create/router.js"));
app.use(require("./pages/update/router.js"));

const port = process.env.PORT || 8962;
app.listen(port, () => console.log("App is running on port", port));
