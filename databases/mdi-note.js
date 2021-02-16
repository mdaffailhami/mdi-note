const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_CONNECTION_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
  }
);

/* 
  Collections
*/

const Account = mongoose.model(
  "Account",
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  }),
  "accounts"
);

const Note = mongoose.model(
  "Note",
  new mongoose.Schema({
    user: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
  }),
  "notes"
);

module.exports = {
  Account,
  Note,
};
