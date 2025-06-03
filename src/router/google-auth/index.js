const express = require("express");
const router = express.Router();
const { GoogleAuthModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get('/auth/google/consent', GoogleAuthModule.redirectConsent);
router.get('/auth/google/callback', GoogleAuthModule.callbackAuth);
router.post('/auth/google/register', [...decryptionMiddleware, middleware.use('modeChecker')], GoogleAuthModule.register);

module.exports = router;
