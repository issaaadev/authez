const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Database = new Schema({
  GuildID: String,
  Guild: String,
  User: String,
  Time: String,
  Amount: String,
});

module.exports = mongoose.model('Usage', Database);