const { default: axios } = require("axios");
const mongoose = require("mongoose");
const { WEB_SERVER, META } = require("../../lib/configs");
const Schema = mongoose.Schema;

// (user id, items, quantity, balance)

const cartSchema = new Schema(
  {
    UUID: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: Object,
      required: true,
    },
    cart: {
      type: Object,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
