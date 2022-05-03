import Joi from 'joi';

const createProductValidator = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().required(),
  tags: Joi.array().items(Joi.string()).required(),
  attributes: Joi.object().required(),
});

const updateProductValidator = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string(),
  image: Joi.string(),
  price: Joi.number(),
  tags: Joi.array().items(Joi.string()),
  attributes: Joi.object(),
});

export { createProductValidator, updateProductValidator };
