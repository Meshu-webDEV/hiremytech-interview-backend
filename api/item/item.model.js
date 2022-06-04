const { default: axios } = require("axios");
const mongoose = require("mongoose");
const { WEB_SERVER, META } = require("../../lib/configs");
const Schema = mongoose.Schema;

// (name, price, description, category, date added)

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.pre("save", async function (next) {
  if (this.category) next();

  // No category

  const { data } = await axios.get(
    `${WEB_SERVER.ORIGIN}/${META.API_VERSION}/categories`
  );

  const category = data.categories.find((d) => d.name === "other");
  this.category = category._id;

  next();
});

module.exports = mongoose.model("Item", itemSchema);
