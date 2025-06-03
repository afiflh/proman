const express = require("express");
const router = express.Router();
const { ProjectModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.post(
  "/api/v1/projects/store",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.createProject"),
  ],
  ProjectModule.store
);
router.get("/api/v1/projects", [middleware.use("auth")], ProjectModule.getAll);
router.put(
  "/api/v1/projects/:id/edit",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.updateProject"),
  ],
  ProjectModule.update
);
router.delete("/api/v1/projects/:id/delete", [middleware.use("auth")], ProjectModule.delete);

router.get("/api/v1/projects/unassigned", [middleware.use("auth")], ProjectModule.getUnassignedProjects);

module.exports = router;
