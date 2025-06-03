const Joi = require("joi");

const createCommentsObject = {
    tasklist_id: Joi.string().required().messages({
        "string.base": "tasklist_id value must be a string",
        "any.required": "tasklist_id field is required",
        "string.empty": "tasklist_id field value cannot be empty",
    }) ,
    comment: Joi.string().required().messages({
        "string.base": "comment value must be a string",
        "any.required": "comment field is required",
        "string.empty": "comment field value cannot be empty",
    }),
    comment_mode: Joi.string().required().messages({
        "string.base": "comment_mod value must be a string",
        "any.required": "comment_mod field is required",
        "string.empty": "comment_mod field value cannot be empty",
    }),
    created_by: Joi.string().required().messages({
        "string.base": "created_by value must be a string",
        "any.required": "created_by field is required",
        "string.empty": "created_by field value cannot be empty",
    }),
};

module.exports = {
    createCommentsObject,
}