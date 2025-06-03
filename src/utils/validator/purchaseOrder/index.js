const Joi = require("joi");

const createPurchaseOrder = {
    po_number: Joi.string().required().messages({
        "string.base": "po_number value must be a string",
        "any.required": "po_number field is required",
        "string.empty": "po_number field value cannot be empty",
    }),
    project_name: Joi.string().required().messages({
        "string.base": "project_name value must be a string",
        "any.required": "project_name field is required",
        "string.empty": "project_name field value cannot be empty",
    }),
    project_type: Joi.string().required().messages({
        "string.base": "project_type value must be a string",
        "any.required": "project_type field is required",
        "string.empty": "project_type field value cannot be empty",
    }),
    duration: Joi.number().integer().strict().required().messages({
        "any.required": "Duration field is required",
        "number.base": "Duration must be a number",
        "number.empty": "Duration field value cannot be empty",
        "number.integer": "Duration must be an integer"
    }),
    customer_id: Joi.string().required().messages({
        "string.base": "customer_id value must be a string",
        "any.required": "customer_id field is required",
        "string.empty": "customer_id field value cannot be empty",
    }),
    created_by: Joi.string().required().messages({
        "string.base": "created_by value must be a string",
        "any.required": "created_by field is required",
        "string.empty": "created_by field value cannot be empty",
    }),
    notification_receivers: Joi.string().required().messages({
        "string.base": "notification_receivers value must be a string",
        "any.required": "notification_receivers field is required",
        "string.empty": "notification_receivers field value cannot be empty",
    }),

};

const updatePurchaseOrder = {
    project_name: Joi.string().required().messages({
        "string.base": "project_name value must be a string",
    }),
    project_type: Joi.string().required().messages({
        "string.base": "project_type value must be a string",
    }),
    duration: Joi.number().integer().strict().required().messages({
        "number.base": "Duration must be a number",
        "number.integer": "Duration must be an integer"
    }),
    customer_id: Joi.string().required().messages({
        "string.base": "customer_id value must be a string",
    }),
    po_date: Joi.date().required().messages({
        "date.base": "po_date value must be a date",
    }),
    notification_receivers: Joi.string().required().messages({
        "string.base": "notification_receivers value must be a string",
    }),
};

module.exports = {
    createPurchaseOrder,
    updatePurchaseOrder,
};
