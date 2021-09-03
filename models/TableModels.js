const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TablesSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, required: true, trim: true, minlength: 2 },
  isMakeFood: { type: Boolean, default: false },
  menu: { type: Array },
  total_cost: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Table", TablesSchema);
