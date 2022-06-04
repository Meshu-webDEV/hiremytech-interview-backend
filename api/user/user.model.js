const { default: axios } = require("axios");
const mongoose = require("mongoose");
const { META, WEB_SERVER } = require("../../lib/configs");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    authority: {
      type: Schema.Types.ObjectId,
      ref: "Authority",
      required: false,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next, settings) {
  if (this.authority) next();

  // No authority
  const { data } = await axios.get(
    `${WEB_SERVER.ORIGIN}/${META.API_VERSION}/authorities`,
    {
      headers: {
        Cookie: `token=${settings["access-token"]};`,
      },
    }
  );

  const authority = data.authorities.find((d) => d.authority === "3");
  this.authority = authority._id;

  next();
});

module.exports = mongoose.model("User", userSchema);
