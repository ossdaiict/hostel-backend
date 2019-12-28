const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    sID: { type: String, required: true, match: /\d{9}/ },
    name: { type: String, required: true },
    cdate: { type: Date, required: true },
    service: { type: String, required: true },
    room: { type: String, required: true },
    cID: { type: String, required: true },
    givenBy: { type: String, required: true },
    type: { type: String, required: true },
    isCourierCollected: { type: Boolean, required: true, default: false }
  },
  { collection: "courier" }
);

module.exports = mongoose.model("User", userSchema);
