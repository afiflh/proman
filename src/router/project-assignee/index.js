const express = require("express");
const router = express.Router();
const { ProjectAssigneeModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get(
  "/api/v1/project-assignee/:userId",
  [middleware.use("auth")],
  ProjectAssigneeModule.getAll
);

router.get(
  "/api/v1/project-assignee/:projectId/boards",
  [middleware.use("auth")],
  ProjectAssigneeModule.getBoardData
);

router.get(
  "/api/v1/project-assignee/top-todo/project",
  [middleware.use("auth")],
  ProjectAssigneeModule.getBoardDataByTopProject
);

router.get(
  "/api/v1/project-assignee/:projectId/assignees",
  [middleware.use("auth")],
  ProjectAssigneeModule.getAssigneeByProject
);

router.put(
  "/api/v1/project-assignee/:kode/status/edit",
  [middleware.use("auth"), ...decryptionMiddleware, middleware.use("modeChecker")],
  ProjectAssigneeModule.updateStatus
);
module.exports = router;
