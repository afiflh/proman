const Joi = require('joi');

const insertUserObjects = {
  id: Joi.string().required().messages({
    'string.base': 'id must be a string',
    'any.required': 'id field is required',
    'string.empty': 'id field value cannot be empty',
  }),
  name: Joi.string().required().messages({
    'string.base': 'name must be a string',
    'any.required': 'name field is required',
    'string.empty': 'name field value cannot be empty',
  }),
  group_id: Joi.string().required().messages({
    'string.base': 'group_id must be a string',
    'any.required': 'group_id field is required',
    'string.empty': 'group_id field value cannot be empty',
  }),
  is_active: Joi.string().required().messages({
    'string.base': 'is_active must be a string',
    'any.required': 'is_active field is required',
    'string.empty': 'is_active field value cannot be empty',
  }),
  created_by: Joi.string().required().messages({
    'string.base': 'created_by must be a string',
    'any.required': 'created_by field is required',
    'string.empty': 'created_by field value cannot be empty',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a valid string.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email field is required.',
    'string.empty': 'Email field cannot be empty.',
  }),
  phone_number: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required().messages({
    'string.base': 'Phone number must be a valid string.',
    'string.pattern.base': 'Phone number must contain only numbers.',
    'string.min': 'Phone number must be at least 10 digits.',
    'string.max': 'Phone number must not exceed 15 digits.',
    'any.required': 'Phone number field is required.',
    'string.empty': 'Phone number field cannot be empty.',
  }),  
};

const updateUserObjects = {
  updated_by: Joi.string().required().messages({
    'string.base': 'updated_by value must be a string',
    'any.required': 'updated_by field is required',
    'string.empty': 'updated_by field value cannot be empty',
  }),
};

module.exports = { insertUserObjects, updateUserObjects };
