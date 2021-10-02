const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TablesSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, required: true, trim: true, minlength: 2 },
  socketID: { type: String, default: "" },
  isMakeFood: { type: Boolean, default: false },
  isPay: { type: Boolean, default: false },
  menu: { type: Array, default: [] },
  total_cost: { type: Number, default: 0 },
  client: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  payedAt: { type: Date },
});

module.exports = mongoose.model("Table", TablesSchema);
