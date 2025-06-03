const Joi = require("joi");

const createProjectStatusObjects = {
    user_assignment: Joi.string().required().messages({
        "string.base": "user_assignment value must be a string",
        "any.required": "user_assignment field is required",
        "string.empty": "user_assignment field value cannot be empty",
    }),
    project_id: Joi.string().required().messages({
        "string.base": "project_id value must be a string",
        "any.required": "project_id field is required",
        "string.empty": "project_id field value cannot be empty",
    }),
    project_status: Joi.string().required().messages({
        "string.base": "project_status value must be a string",
        "any.required": "project_status field is required",
        "string.empty": "project_status field value cannot be empty",
    }),
    created_by: Joi.string().required().messages({
        "string.base": "created_by value must be a string",
        "any.required": "created_by field is required",
        "string.empty": "created_by field value cannot be empty",
    }),
};

const updateProjectStatusObjects = {
    user_assignment: Joi.string().optional().messages({ 
        "string.base": "user_assignment value must be a string", 
        "string.empty": "user_assignment field value cannot be empty" 
    }),
};

module.exports = {
    createProjectStatusObjects, updateProjectStatusObjects
};