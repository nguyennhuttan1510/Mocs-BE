const mongoose = require("mongoose");
const uuidv4 = require("uuid4");
const Schema = mongoose.Schema;
// const UUID = mongoose.Types.UUID;

const TablesSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String },
  menu: { type: Array },
  server: Schema.Types.Mixed,
  total_cost: { type: Number },
  createdAt: { type: Date },
  finishedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", TablesSchema);
