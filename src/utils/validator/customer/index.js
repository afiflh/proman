const Joi = require("joi");

const createCustomer = {
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
    is_active: Joi.string().required().messages({
        "string.base": "is_active must be a string",
        "any.required": "is_active field is required",
        "string.empty": "is_active field value cannot be empty",
    }),
    created_by: Joi.string().required().messages({
        "string.base": "created_by must be a string",
        "any.required": "created_by field is required",
        "string.empty": "created_by field value cannot be empty",
    }),
};

const updateCustomer = {
    name: Joi.string().messages({
        "string.base": "name must be a string",
    }),
    is_active: Joi.string().messages({
        "string.base": "is_active must be a string",
    }),
    created_by: Joi.string().messages({
        "string.base": "created_by must be a string",
    }),
    updated_by: Joi.string().messages({
        "string.base": "value of menu_list field must be a string",
    }),
};

module.exports = {
    createCustomer,
    updateCustomer,
};
