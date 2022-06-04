const { default: axios } = require("axios");
const mongoose = require("mongoose");
const { WEB_SERVER, META } = require("../../lib/configs");
const Schema = mongoose.Schema;

// (user id, items, quantity, balance)

const orderSchema = new Schema(
  {
    UUID: {
      // X
      type: String,
      required: true,
      unique: true,
    },
    items: {
      // X
      type: Object,
      required: true,
    },
    total: {
      // X
      type: Number,
      required: true,
    },
    price: {
      // X
      type: String,
      required: true,
    },
    user: {
      // X
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
