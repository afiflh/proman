const express = require("express");
const router = express.Router();
const { MenuModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get("/api/v1/menus", [middleware.use("auth")], MenuModule.getAll);

module.exports = router;
