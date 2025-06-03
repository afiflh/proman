const { update } = require("lodash");
const AuthenticationMiddleware = require("./authentication");
// const { otorisasi: otorisasiMiddleware } = require('./authorization');
const SecurityMiddleware = require("./security");
const ValidatorMiddleware = require("./validator");
const FileHandler = require("./fileHandler");

class MiddlewareManager {
  constructor() {
    // register middleware
    this.middleware = {
      auth: AuthenticationMiddleware.auth,
      modeChecker: SecurityMiddleware.modeChecker,
      decryption: SecurityMiddleware.decryption,
      uploadMultiple: FileHandler.multipleUpload,
      validator: {
        // nospace: ValidatorMiddleware.validateNospace,
        login: ValidatorMiddleware.validateLogin,
        confirmLogin: ValidatorMiddleware.validateConfirmLogin,
        addUser: ValidatorMiddleware.validateAddUser,
        updateUser: ValidatorMiddleware.validateEditUser,
        addGroup: ValidatorMiddleware.validateAddGroup,
        updateGroup: ValidatorMiddleware.validateEditGroup,
        createProject: ValidatorMiddleware.validateCreateProject,
        updateProject: ValidatorMiddleware.validateUpdateProject,
        createStatus: ValidatorMiddleware.validateCreateStatus,
        updateStatus: ValidatorMiddleware.validateUpdateStatus,
        createProjectStatus: ValidatorMiddleware.validateCreateProjectStatus,
        updateProjectStatus: ValidatorMiddleware.validateUpdateProjectStatus,
        createTaskList: ValidatorMiddleware.validateCreateTaskList,
        updateTaskList: ValidatorMiddleware.validateUpdateTaskList,
        createSubtasklist: ValidatorMiddleware.validateCreateSubtasklist,
        updateSubtasklist: ValidatorMiddleware.validateUpdateSubtasklist,
        createComment: ValidatorMiddleware.validateCreateComments,
        createPurchaseOrder: ValidatorMiddleware.validateCreatePurchaseOrder,
        updatePurchaseOrder: ValidatorMiddleware.validateUpdatePurchaseOrder,
        createCustomer: ValidatorMiddleware.validateCreateCustomer,
        updateCustomer: ValidatorMiddleware.validateUpdateCustomer
      },
    };
  }

  use(name) {
    let middlewareUsed = null;
    if (name.includes(".")) {
      const parts = name.split(".");
      middlewareUsed = this.middleware[parts[0]][parts[1]];
    } else {
      middlewareUsed = this.middleware[name];
    }

    if (middlewareUsed === null || middlewareUsed === undefined) {
      throw new Error("middleware not found");
    }

    return middlewareUsed;
  }
}

module.exports = new MiddlewareManager();
