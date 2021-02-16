const querystring = require("querystring");
const database = require("../../databases/mdi-note.js");
const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render(`${__dirname}/register.ejs`);
});

router.post("/register", (req, res) => {
  req.on("data", (chunk) => {
    const data = querystring.parse(String(chunk));

    // Cek jika email sudah terdaftar
    database.Account.find({ email: data.email }, (err, docs) => {
      if (err) throw err;

      if (docs.length >= 1) {
        res.send(
          `<script>
            alert("Email sudah terdaftar!!!");
            document.location.href = "/register";
          </script>`
        );
        return;
      }

      // Cek jika confirm password salah
      if (data.password != data.confirm_password) {
        res.send(
          `<script>
            alert("Confirm password salah!!!");
            document.location.href = "/register";
          </script>`
        );
        return;
      }

      /*
        Kirim kode konfirmasi ke email user
      */

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      const verificationCode = Math.floor(Math.random() * (999999 - 0 + 1)) + 0;
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: data.email,
        subject: "MDI-Note Verification Code",
        text: `Your verification code is ${verificationCode}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;

        console.log("Email sent: " + info.response);
        res.render(`${__dirname}/verification.ejs`, {
          verificationCode,
          data,
        });
      });
    });
  });
});

router.post("/register/check-verification", (req, res) => {
  req.on("data", (chunk) => {
    const data = querystring.parse(String(chunk));

    // Cek jika kode verifikasi yang diinputkan itu salah
    if (data["input_verification_code"] != data["sent_verification_code"]) {
      res.send(
        `<script>
          alert("Verification code is wrong!!!");
          document.location.href = "/register";
        </script>`
      );
      return;
    }

    // Menginkripsikan password
    bcrypt.hash(data["password"], 10, (err, encrypted) => {
      if (err) throw err;
      console.log(encrypted);
      // Menambahkan akun ke dalam Database
      database.Account.create(
        {
          email: data["email"],
          password: encrypted,
        },
        (err, doc) => {
          if (err) throw err;

          console.log("\nREGISTER:\n", doc);

          res.send(
            `<script>
              alert("Registration is successful!!!");
              document.location.href = "/login";
            </script>`
          );
        }
      );
    });
  });
});

module.exports = router;
