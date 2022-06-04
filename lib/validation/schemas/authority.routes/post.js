const Joi = require("joi");

module.exports = Joi.object({
  authority: Joi.number().required(),
  name: Joi.string().normalize().trim().required(),
  description: Joi.string().required(),
  privileges: Joi.array().items(Joi.string().required()).required(),
});
