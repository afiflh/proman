const Joi = require("joi");

const createTaskListObjects = {
    title: Joi.string().required().messages({
        "string.base": "title must be a string",
        "any.required": "title field is required",
        "string.empty": "title field value cannot be empty",
    }),
    description: Joi.string().messages({
        "string.base": "description must be a string",
        "any.required": "description field is required",
        "string.empty": "description field value cannot be empty",
    }),
    attachment: Joi.string().allow(null, '').messages({
        "string.base": "attachment must be a string",
    }),
    assignee: Joi.string().required().messages({
        "string.base": "assignee must be a string",
        "any.required": "assignee field is required",
        "string.empty": "assignee field value cannot be empty",
    }),
    duedate: Joi.date().required().messages({
        "date.base": "duedate must be a date",
        "any.required": "duedate field is required",
        "date.empty": "duedate field value cannot be empty",
    }),
};


const updateTaskListObjects = {
    title: Joi.string().messages({
        "string.base": "title must be a string",
    }),
    description: Joi.string().messages({
        "string.base": "description must be a string"
    }),
    attachment: Joi.string().allow(null, '').messages({
        "string.base": "attachment must be a string"
    }),
    duedate: Joi.date().messages({
        "date.base": "duedate must be a date"
    }),
};

module.exports = {
    createTaskListObjects,
    updateTaskListObjects,
};
