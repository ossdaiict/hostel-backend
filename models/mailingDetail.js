const mongoose = require("mongoose");

const { Schema } = mongoose;

const mailingSchema = new Schema(
  {
    sID: { type: Number, required: true, match: /\d{9}/ },
    cID: { type: String, required: true },
    initialDate: { type: String, required: true },
    mailCount: { type: Number, default: 0, required: true }
  },
  {
    collection: "mailingDetails"
  }
);

module.exports = mongoose.model("CourierMailingDetails", mailingSchema);
