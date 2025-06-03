const express = require("express");
const router = express.Router();
const { TasklistModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get(
  "/api/v1/task-list/:tasklistcode/detail",
  [middleware.use("auth")],
  TasklistModule.getDetail
);
router.get("/api/v1/task-list", [middleware.use("auth")], TasklistModule.getAll);
router.get(
  "/api/v1/task-list/:project_id/by-project",
  [middleware.use("auth")],
  TasklistModule.getByProjectId
);
router.post(
  "/api/v1/task-list/store",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.createTaskList"),
  ],
  TasklistModule.store
);
router.put(
  "/api/v1/task-list/:kode/edit",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.updateTaskList"),
  ],
  TasklistModule.update
);

router.put(
  "/api/v1/task-list/:kode/assignee/edit",
  [middleware.use("auth"), ...decryptionMiddleware, middleware.use("modeChecker")],
  TasklistModule.updateAssignee
);


module.exports = router;
