const express = require("express");
const router = express.Router();
const { SubtasklistModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.post(
  "/api/v1/subtasklist/store",
  [middleware.use("auth"), ...decryptionMiddleware, middleware.use("modeChecker"), middleware.use('validator.createSubtasklist')],
  SubtasklistModule.store
);

router.get(
  "/api/v1/substasklist/:tasklistCode/get-all",
  [middleware.use("auth")],
  SubtasklistModule.getAll
);

router.put(
  "/api/v1/subtasklist/:subtasklistCode/edit",
  [middleware.use("auth"), ...decryptionMiddleware, middleware.use("modeChecker"), middleware.use('validator.updateSubtasklist')],
  SubtasklistModule.edit
);

router.put(
  "/api/v1/subtasklist/:subtasklistCode/status/edit",
  [middleware.use("auth"), ...decryptionMiddleware, middleware.use("modeChecker")],
  SubtasklistModule.editStatus
);

router.put(
  "/api/v1/subtasklist/:subtasklistCode/assignee/edit",
  [middleware.use("auth"), ...decryptionMiddleware, middleware.use("modeChecker")],
  SubtasklistModule.editAssignee
);
module.exports = router;
