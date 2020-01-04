const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    sID: { type: Number, required: true, match: /\d{9}/ },
    name: { type: String, required: true },
    wing: { type: String, required: true },
    room: { type: String, required: true },
    type: { type: String, required: true },
    initialDate: { type: String, required: true },
    isValid: { type: Boolean, required: true, default: true },
    isResolve: { type: Boolean, required: true, default: false },
    complaint: { type: String, required: true },
    isReOpen: { type: Boolean, required: true, default: false },
    reOpenDate: { type: String }
  },
  { collection: "complaint" }
);

module.exports = mongoose.model("Complaint", userSchema);
