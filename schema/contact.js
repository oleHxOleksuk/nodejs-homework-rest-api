const Joi = require("joi");

const addSchema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": '"name" is required',
      "string.empty": '"name" cannot be empty',
      "string.base": '"name" must be string',
    }),
    email: Joi.string().required().messages({
      "any.required": '"email" is required',
      "string.empty": '"email" cannot be empty',
      "string.base": '"email" must be string',
    }),
    phone: Joi.string().required().messages({
      "any.required": '"phone" is required',
      "string.empty": '"phone" cannot be empty',
      "string.base": '"phone" must be string',
    }),
  });
  
  const addSchemaPut = Joi.object({
    name: Joi.string().messages({
      "string.empty": '"name" cannot be empty',
      "string.base": '"name" must be string',
    }),
    email: Joi.string().messages({
      "string.empty": '"email" cannot be empty',
      "string.base": '"email" must be string',
    }),
    phone: Joi.string().messages({
      "string.empty": '"phone" cannot be empty',
      "string.base": '"phone" must be string',
    }),
  });

  module.exports = {
    addSchema,
    addSchemaPut,
  }