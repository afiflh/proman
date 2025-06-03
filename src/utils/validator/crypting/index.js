const Joi = require("joi");

const cryptingObject = {
  msg: Joi.string().required().messages({
    "string.base": "value msg field must be a string",
    "any.required": "missing field msg",
    "string.empty": "value msg field cannot be empty",
  }),
};

module.exports = { cryptingObject };
