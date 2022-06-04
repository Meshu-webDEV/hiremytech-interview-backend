const Joi = require("joi");

module.exports = Joi.object({
  name: Joi.string().normalize().trim().required(),
});
