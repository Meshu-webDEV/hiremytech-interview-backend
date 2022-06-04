const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authoritySchema = new Schema(
  {
    authority: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    privileges: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Authority", authoritySchema);
