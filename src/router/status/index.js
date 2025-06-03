const express = require("express");
const router = express.Router();
const { StatusModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get("/api/v1/status", [middleware.use("auth")], StatusModule.getAll);
router.post(
  "/api/v1/status/store",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.createStatus"),
  ],
  StatusModule.store
);
router.put(
  "/api/v1/status/:id/edit",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.updateStatus"),
  ],
  StatusModule.update
);
router.delete("/api/v1/status/:id/delete", [middleware.use("auth")], StatusModule.delete);

module.exports = router;
