const Joi = require("joi");

const createProjectObject = {
  id: Joi.string().required().messages({
    "string.base": "id value must be a string",
    "any.required": "id field is required",
    "string.empty": "id field value cannot be empty",
  }),
  name: Joi.string().required().messages({
    "string.base": "name value must be a string",
    "any.required": "name field is required",
    "string.empty": "name field value cannot be empty",
  }),
  status: Joi.string().required().messages({
    "string.base": "status value must be a string",
    "any.required": "status field is required",
    "string.empty": "status field value cannot be empty",
  }),
  start_date: Joi.date().required().messages({
    "date.base": "start_date must be a valid date",
    "any.required": "start_date is required",
    "date.empty": "start_date field value cannot be empty",
  }),
  end_date: Joi.string().required().messages({
    "date.base": "end_date must be a valid date",
    "any.required": "end_date is required",
    "date.empty": "end_date field value cannot be empty",
  }),
  created_by: Joi.string().required().messages({
    "string.base": "created_by value must be a string",
    "any.required": "created_by field is required",
    "string.empty": "created_by field value cannot be empty",
  }),
};

const updateProjectObject = {
  name: Joi.string().messages({
    "string.base": "name value must be a string",
  }),
  status: Joi.string().messages({
    "string.base": "status value must be a string",
  }),
  start_date: Joi.date().messages({
    "date.base": "start_date must be a valid date",
  }),
  end_date: Joi.string().messages({
    "date.base": "end_date must be a valid date",
  }),
  updated_by: Joi.string().messages({
    "string.base": "updated_by value must be a string",
  }),
};

module.exports = {
  createProjectObject,
  updateProjectObject,
};
