const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, default: null },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  category: { type: String, default: null, enum: ["food", "drink"] },
  url_image: { type: String, default: null },
  description_short_food: { type: String, default: "" },
  description: { type: String, default: "" },
  feedback: {
    rank: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    heart: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("Menu", MenuSchema);
