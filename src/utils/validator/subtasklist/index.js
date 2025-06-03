const Joi = require("joi");

const createSubtasklistObjects = {
    tasklist_id: Joi.string().required().max(100).messages({
        "string.base": "tasklist_id must be a string",
        "any.required": "tasklist_id field is required",
        "string.empty": "tasklist_id field value cannot be empty",
        "string.max": "tasklist_id must be at most 100 characters",
    }),
    title: Joi.string().required().max(100).messages({
        "string.base": "title must be a string",
        "any.required": "title field is required",
        "string.empty": "title field value cannot be empty",
        "string.max": "title must be at most 100 characters",
    }),
    description: Joi.string().messages({
        "string.base": "description must be a string",  
    }),
    attachment: Joi.string().allow(null, '').messages({
        "string.base": "attachment must be a string",
    }),
    assignee: Joi.string().required().max(150).messages({
        "string.base": "assignee must be a string",
        "any.required": "assignee field is required",
        "string.empty": "assignee field value cannot be empty",
        "string.max": "assignee must be at most 150 characters",
    }),
    created_by: Joi.string().required().max(100).messages({
        "string.base": "created_by must be a string",
        "any.required": "created_by field is required",
        "string.empty": "created_by field value cannot be empty",
        "string.max": "created_by must be at most 100 characters",
    }),
};


const updateSubtasklistObject = {
    status_id: Joi.string().optional().max(60).messages({
        "string.base": "status_id must be a string",
        "string.max": "status_id must be at most 60 characters",
    }),
    title: Joi.string().optional().max(100).messages({
        "string.base": "title must be a string",
        "string.empty": "title field value cannot be empty",
        "string.max": "assignee must be at most 100 characters",
    }),
    description: Joi.string().optional().messages({
        "string.base": "description must be a string",
    }),
    attachment: Joi.string().allow(null, '').messages({
        "string.base": "attachment must be a string",
    }),
    assignee: Joi.string().optional().max(150).messages({
        "string.base": "assignee must be a string",
        "string.empty": "assignee field value cannot be empty",
        "string.max": "assignee must be at most 150 characters",
    }),
};

module.exports = {
    createSubtasklistObjects,
    updateSubtasklistObject,
};
