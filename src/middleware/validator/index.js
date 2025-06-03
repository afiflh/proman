const { ResponseHandler, ValidatorTool } = require("../../utils");

class ValidatorMiddleware {
  static validateLogin(req, res, next) {
    const { error } = ValidatorTool.loginValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateConfirmLogin(req, res, next) {
    const { error } = ValidatorTool.confirmLoginValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateAddUser(req, res, next) {
    console.log("🚀 ~ file: index.js:17 ~ req.bodyRequest:", req.bodyRequest)
    const { error } = ValidatorTool.addUserValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateEditUser(req, res, next) {
    const { error } = ValidatorTool.updateUserValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateAddGroup(req, res, next) {
    const { error } = ValidatorTool.addGroupValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateEditGroup(req, res, next) {
    const { error } = ValidatorTool.updateGroupValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  // static validateNospace(req, res, next) {
  //   if (/\s/.test(req.bodyRequest.name)) {
  //     return ResponseHandler.error(res, ["name cannot contain spaces"], {}, 400);
  //   }
  //   next();
  // }

  static validateCreateProject(req, res, next) {
    const { error } = ValidatorTool.createProjectValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      console.log("🚀 ~ ValidatorMiddleware ~ validateCreateProject ~ error:", error.message);
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateUpdateProject(req, res, next) {
    const { error } = ValidatorTool.updateProjectValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      console.log("🚀 ~ ValidatorMiddleware ~ validateUpdateProject ~ error:", error.message);
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateCreateStatus(req, res, next) {
    const { error } = ValidatorTool.createStatusValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      console.log("🚀 ~ ValidatorMiddleware ~ validateCreateStatus ~ error:", error.message);
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateUpdateStatus(req, res, next) {
    const { error } = ValidatorTool.updateStatusValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      console.log("🚀 ~ ValidatorMiddleware ~ validateUpdateStatus ~ error:", error.message);
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateCreateProjectStatus(req, res, next) {
    const { error } = ValidatorTool.createProjectStatusValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      console.log("🚀 ~ ValidatorMiddleware ~ validateCreateProjectStatus ~ error:", error.message);
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateUpdateProjectStatus(req, res, next) {
    const { error } = ValidatorTool.updateProjectStatusValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      console.log("🚀 ~ ValidatorMiddleware ~ validateCreateProjectStatus ~ error:", error.message);
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateCreateTaskList(req, res, next) {
    const { error } = ValidatorTool.createTaskListValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      console.log("🚀 ~ ValidatorMiddleware ~ validateCreateTaskList ~ error:", error.message);
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateUpdateTaskList(req, res, next) {
    const { error } = ValidatorTool.updateTaskListValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      console.log("🚀 ~ ValidatorMiddleware ~ validateUpdateTaskList ~ error:", error.message);
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateCreateComments(req, res, next) {
    const { error } = ValidatorTool.createCommentsValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      console.log("🚀 ~ ValidatorMiddleware ~ validateCreateComments ~ error:", error.message);
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateCreateSubtasklist(req, res, next) {
    const { error } = ValidatorTool.createSubtasklistValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateUpdateSubtasklist(req, res, next) {
    const { error } = ValidatorTool.updateSubtasklistValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateCreatePurchaseOrder(req, res, next) {
    const { error } = ValidatorTool.createPurchaseOrder().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateUpdatePurchaseOrder(req, res, next) {
    const { error } = ValidatorTool.updatePurchaseOrder().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateCreateCustomer(req, res, next) {
    const { error } = ValidatorTool.createCustomer().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateUpdateCustomer(req, res, next) {
    const { error } = ValidatorTool.updateCustomer().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }
}

module.exports = ValidatorMiddleware;
