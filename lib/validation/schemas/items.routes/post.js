const Joi = require("joi");

module.exports = Joi.object({
  name: Joi.string().normalize().trim().required(),
  description: Joi.string(),
  category: Joi.string(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
});
