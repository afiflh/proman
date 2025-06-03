const express = require("express");
const router = express.Router();
const { ProjectStatusModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get("/api/v1/project-status", [middleware.use("auth")], ProjectStatusModule.getAll);
router.post(
  "/api/v1/project-status/store",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.createProjectStatus"),
  ],
  ProjectStatusModule.store
);
router.put(
  "/api/v1/project-status/:id/edit",
  [middleware.use("auth"), ...decryptionMiddleware, middleware.use("modeChecker"), middleware.use("validator.updateProjectStatus")],
  ProjectStatusModule.edit
);
router.delete(
  "/api/v1/project-status/:id/delete",
  [middleware.use("auth")],
  ProjectStatusModule.delete
);

module.exports = router;
