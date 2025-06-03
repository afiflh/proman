const express = require("express");
const router = express.Router();
const { GroupModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get("/api/v1/groups", [middleware.use("auth")], GroupModule.getAll);
router.post(
  "/api/v1/groups/store",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.addGroup"),
  ],
  GroupModule.store
);
router.put(
  "/api/v1/groups/:id/edit",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.updateGroup"),
  ],
  GroupModule.update
);
router.get("/api/v1/groupsName", [middleware.use("auth")], GroupModule.getAllDropdown);

module.exports = router;
