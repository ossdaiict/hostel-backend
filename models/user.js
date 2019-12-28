const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    sID: { type: String, required: true, match: /\d{9}/, unique: true },
    name: { type: String, required: true },
    wing: { type: String, required: true },
    room: { type: Number, required: true },
    password: { type: String, required: true },
    isUserVerified: { type: Boolean, default: false },
    isHMC: { type: Boolean, default: false },
    isSupervisor: { type: Boolean, default: false }
  },
  { collection: "user" }
);

module.exports = mongoose.model("User", userSchema);
