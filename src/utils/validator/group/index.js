const Joi = require("joi");

const addGroupObjects = {
  id: Joi.string().required().messages({
    "string.base": "id must be a string",
    "any.required": "id field is required",
    "string.empty": "id field value cannot be empty",
  }),
  description: Joi.string().required().messages({
    "string.base": "description must be a string",
    "any.required": "description field is required",
    "string.empty": "description field value cannot be empty",
  }),
  is_active: Joi.string().required().messages({
    "string.base": "id must be a string",
    "any.required": "id field is required",
    "string.empty": "id field value cannot be empty",
  }),
  created_by: Joi.string().required().messages({
    "string.base": "created_by must be a string",
    "any.required": "created_by field is required",
    "string.empty": "created_by field value cannot be empty",
  }),
};

const updateGroupObjects = {
  description: Joi.string().messages({
    "string.base": "value of description field must be a string",
  }),
  is_active: Joi.string().messages({
    "string.base": "value of is_active field must be a string",
  }),
  menu_list: Joi.string().messages({
    "string.base": "value of menu_list field must be a string",
  }),
  updated_by: Joi.string().messages({
    "string.base": "value of menu_list field must be a string",
  }),
};

module.exports = {
  addGroupObjects,
  updateGroupObjects,
};
