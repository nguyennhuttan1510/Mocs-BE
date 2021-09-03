const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, default: null },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  category: { type: String, default: null, enum: ["food", "drink"] },
});

module.exports = mongoose.model("Menu", MenuSchema);
