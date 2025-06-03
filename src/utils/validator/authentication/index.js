const Joi = require("joi");

const loginObjects = {
  id: Joi.required().messages({
    "any.required": "id field is required",
    "number.empty": "id field value cannot be empty",
  }),
  secret_key: Joi.string().required().messages({
    "string.base": "secret key must be a string",
    "any.required": "secret_key field is required",
    "string.empty": "secret_key field value cannot be empty",
  }),
};

const confirmLoginObjects = {
  user_id: Joi.string().required().messages({
    "any.required": "user_id field is required",
    "number.empty": "user_id field value cannot be empty",
  }),
  device_id: Joi.string().required().messages({
    "string.base": "device_id must be a string",
    "any.required": "device_id field is required",
    "string.empty": "device_id field value cannot be empty",
  }),
}

module.exports = { loginObjects, confirmLoginObjects };
