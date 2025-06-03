const express = require("express");
const router = express.Router();
const { UserModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get("/api/v1/users/find", [middleware.use('auth')], UserModule.getByTag);
// router.get("/api/v1/users", [middleware.use("auth")], UserModule.getAll);
router.post(
  "/api/v1/users/store",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.addUser"),
    // middleware.use("validator.nospace"),
  ],
  UserModule.store
);
router.put(
  "/api/v1/users/:id/edit",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.updateUser"),
    // middleware.use("validator.nospace"),
  ],
  UserModule.update
);
router.get("/api/v1/users", [middleware.use("auth")], UserModule.getAllWithGroup);

router.put(
  "/api/v1/users/:id/password/edit",
  [middleware.use("auth"), middleware.use("modeChecker")],
  UserModule.updatePassword
);

router.put(
  "/api/v1/users/:id/edit-profile",
  [middleware.use("auth"), ...decryptionMiddleware, middleware.use("modeChecker")],
  UserModule.editProfile
);

module.exports = router;
