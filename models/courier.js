const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    cdate: { type: String, required: true },
    service: { type: String, required: true },
    room: { type: String, required: true },
    cID: { type: String, required: true },
    type: { type: String, required: true },
    isCourierCollected: { type: Boolean, required: true, default: false }
  },
  { collection: "courier" }
);

module.exports = mongoose.model("Courier", userSchema);
