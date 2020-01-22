const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    sID: { type: Number, required: true, match: /\d{9}/, unique: true },
    name: { type: String, required: true },
    wing: { type: String, required: true },
    room: { type: String, required: true },
    password: { type: String, required: true },
    isHMCVerified: { type: Boolean, default: false },
    isSupervisor: { type: Boolean, default: false },
    isHMCConvener: { type: Boolean, default: false }
  },
  { collection: "user" }
);

module.exports = mongoose.model("User", userSchema);
