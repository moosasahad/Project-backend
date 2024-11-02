const Joi = require('joi');

const JoiProductSchema = Joi.object({
  name: Joi.string(),
  type: Joi.string(),
  image: Joi.string().uri(),
  price: Joi.number(),
  offerprice: Joi.number().optional(),
  qty: Joi.number().integer().min(0),
  description: Joi.string().optional(),
  brand: Joi.string(),
  rating: Joi.number().min(0).max(5).optional(),
  reviews: Joi.number().min(1).max(10).optional()
});

module.exports = { JoiProductSchema };
