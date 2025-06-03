const Joi = require("joi");
const { update } = require("lodash");

const createStatusObjects = {
  id: Joi.string().required().messages({
    "string.base": "id must be a string",
    "any.required": "id field is required",
    "string.empty": "id field value cannot be empty",
  }),
  name: Joi.string().required().messages({
    "string.base": "name must be a string",
    "any.required": "name field is required",
    "string.empty": "name field value cannot be empty",
  }),
  description: Joi.string().required().messages({
    "string.base": "description must be a string",
    "any.required": "description field is required",
    "string.empty": "description field value cannot be empty",
  }),
  created_by: Joi.string().required().messages({
    "string.base": "created_by must be a string",
    "any.required": "created_by field is required",
    "string.empty": "created_by field value cannot be empty",
  }),
};

const updateStatusObjects = {
  name: Joi.string().messages({
    "string.base": "name must be a string",
  }),
  description: Joi.string().messages({
    "string.base": "description must be a string"
  }),
};

module.exports = { 
  createStatusObjects,
  updateStatusObjects,
};
