const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render(`${__dirname}/index.ejs`, {
    userEmail: req.session.user,
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("lol");
  res.redirect("/login");
});

module.exports = router;
