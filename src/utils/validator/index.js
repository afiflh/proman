const { loginObjects, confirmLoginObjects } = require("./authentication");
const { cryptingObject } = require("./crypting");
const { insertUserObjects, updateUserObjects } = require("./user");
const { updateGroupObjects, addGroupObjects } = require("./group");
const { createProjectObject, updateProjectObject } = require("./project");
const { createStatusObjects, updateStatusObjects } = require("./status");
const { createProjectStatusObjects, updateProjectStatusObjects } = require("./project-status");
const { createTaskListObjects, updateTaskListObjects } = require("./tasklist");
const { createCommentsObject } = require("./comments");
const { createSubtasklistObjects, updateSubtasklistObject } = require('./subtasklist');
const { createPurchaseOrder, updatePurchaseOrder } = require('./purchaseOrder')
const { createCustomer, updateCustomer } = require("./customer");

const Joi = require("joi");

class ValidatorTool {
  static buildJoi(optionValidate) {
    return Joi.object(optionValidate).unknown(true);
  }

  static loginValidator() {
    const validator = this.buildJoi(loginObjects);
    return validator;
  }

  static confirmLoginValidator() {
    return this.buildJoi(confirmLoginObjects);
  }

  static cryptingValidator() {
    const validator = this.buildJoi(cryptingObject);
    return validator;
  }

  static addUserValidator() {
    const validator = this.buildJoi(insertUserObjects);
    return validator;
  }

  static updateUserValidator() {
    const validator = this.buildJoi(updateUserObjects);
    return validator;
  }

  static addGroupValidator() {
    const validator = this.buildJoi(addGroupObjects);
    return validator;
  }

  static updateGroupValidator() {
    const validator = this.buildJoi(updateGroupObjects);
    return validator;
  }

  static createProjectValidator() {
    const validator = this.buildJoi(createProjectObject);
    return validator;
  }

  static updateProjectValidator() {
    const validator = this.buildJoi(updateProjectObject);
    return validator;
  }

  static createStatusValidator() {
    const validator = this.buildJoi(createStatusObjects);
    return validator;
  }

  static updateStatusValidator() {
    const validator = this.buildJoi(updateStatusObjects);
    return validator;
  }

  static createProjectStatusValidator() {
    const validator = this.buildJoi(createProjectStatusObjects);
    return validator;
  }

  static updateProjectStatusValidator() {
    const validator = this.buildJoi(updateProjectStatusObjects);
    return validator;
  }

  static createTaskListValidator() {
    const validator = this.buildJoi(createTaskListObjects);
    return validator;
  }

  static updateTaskListValidator() {
    const validator = this.buildJoi(updateTaskListObjects);
    return validator;
  }

  static createCommentsValidator() {
    const validator = this.buildJoi(createCommentsObject);
    return validator;
  }

  static createSubtasklistValidator() {
    const validator = this.buildJoi(createSubtasklistObjects);
    return validator;
  }

  static updateSubtasklistValidator() {
    const validator = this.buildJoi(updateSubtasklistObject);
    return validator;
  }

  static createPurchaseOrder() {
    const validator = this.buildJoi(createPurchaseOrder);
    return validator;
  }

  static updatePurchaseOrder() {
    const validator = this.buildJoi(updatePurchaseOrder);
    return validator;
  }

  static createCustomer() {
    const validator = this.buildJoi(createCustomer);
    return validator;
  }

  static updateCustomer() {
    const validator = this.buildJoi(updateCustomer);
    return validator;
  }
}

module.exports = { ValidatorTool };
