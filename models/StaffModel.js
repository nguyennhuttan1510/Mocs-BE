const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
  id: { type: Number, unique: true, required: true, trim: true }, // ID GỒM MÃ NHÂN VIÊN VÀ ID CHỨC VỤ EX:001.1
  name: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
  phone: { type: String, default: null },
  avatar: { type: String, default: null },
  position: {
    type: String,
    default: "Staff",
    enum: ["Staff", "Chef", "Manager", "Admin", "Client"],
  },
  point: { type: Number, default: 0 },
  salary: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  feedback: {
    heart: { type: Array, default: [] },
    like: { type: Array, default: [] },
    dislike: { type: Array, default: [] },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Staff", StaffSchema);
