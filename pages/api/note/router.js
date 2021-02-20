const querystring = require("querystring");
const database = require("../../../databases/mdi-note.js");
const express = require("express");

const router = express.Router();

router.get("/api/note", (req, res) => {
  database.Note.find({ user: req.session.user }, (err, docs) => {
    if (err) throw err;
    // Jika keyword-nya kosong
    let notes = docs;

    // Jika keyword-nya TIDAK kosong
    if (req.query["keyword"] != undefined) {
      notes = [];
      for (let i = 0; i < docs.length; i++) {
        if (docs[i]["title"].toUpperCase().includes(req.query["keyword"].toUpperCase())) {
          notes.push(docs[i]);
        }
      }
    }

    res.json({ status: "success", notes });
  });
});

router.post("/api/note", (req, res) => {
  req.on("data", (chunk) => {
    const data = querystring.parse(String(chunk));

    database.Note.create(
      {
        user: req.session["user"],
        title: data["title"],
        content: data["content"],
      },
      (err, doc) => {
        if (err) {
          res.json({ status: "failed" });
          return;
        }
        console.log("\nCREATE:", doc);

        // res.redirect("/");
        res.json({ status: "success", note: doc });
      }
    );
  });
});

router.delete("/api/note", (req, res) => {
  database.Note.findByIdAndDelete(req.query["_id"], (err, doc) => {
    if (err || req.query["_id"] == undefined) {
      res.json({ status: "failed" });
      return;
    }
    console.log("\nDELETE:", doc);

    res.json({ status: "success", note: doc });
  });
});

router.put("/api/note", (req, res) => {
  req.on("data", (chunk) => {
    const data = querystring.parse(String(chunk));
    console.log(req.query._id);
    database.Note.findById(req.query["_id"], (err, doc) => {
      console.log("masuk lurr");
      if (err || req.query["_id"] == undefined) {
        res.json({ status: "failed" });
        return;
      }

      database.Note.updateOne(
        { _id: doc["_id"] },
        {
          title: data["title"],
          content: data["content"],
          __v: doc["__v"] + 1,
        },
        (err) => {
          if (err) {
            res.json({ status: "failed" });
            return;
          }
          console.log("\nUPDATE:", doc);

          res.json({ status: "success", note: doc });
        }
      );
    });
  });
});

module.exports = router;
