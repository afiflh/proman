const express = require("express");
const router = express.Router();
const { AuthenticationModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.post(
  "/login",
  [
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.login"),
    // middleware.use("validator.nospace"),
  ],
  AuthenticationModule.login
);

router.post('/confirm-login',
  [
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.confirmLogin"),
  ],
  AuthenticationModule.confirmLogin
);

router.post('/send/email/forgot-password',
  [...decryptionMiddleware,
  middleware.use("modeChecker")
  ],
  AuthenticationModule.sendEmailForgotPassword
);

router.put('/update/password/forgot-password',
  [...decryptionMiddleware,
  middleware.use("modeChecker")
  ],
  AuthenticationModule.resetForgotPassword
)

router.put("/logout", [middleware.use("auth")], AuthenticationModule.logout);


module.exports = router;
