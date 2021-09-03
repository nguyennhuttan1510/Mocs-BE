const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DefaultTableSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, default: null },
});

module.exports = mongoose.model("DefaultTable", DefaultTableSchema);
