const Joi = require("joi");

module.exports = Joi.object({
  username: Joi.string()
    .normalize()
    .trim()
    .alphanum()
    .min(3)
    .max(54)
    .required(),
  password: Joi.string().trim().min(6).max(124).required(),
  "confirm-password": Joi.any()
    .required()
    .equal(Joi.ref("password"))
    .label("confirm-password")
    .messages({ "any.only": "{{#label}} does not match" }),
  email: Joi.string().normalize().email(),
});
