const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Event = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },
  url_image: { type: String, default: null },
});

module.exports = mongoose.model("event", Event);
