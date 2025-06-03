const { ResponseHandler, CryptingTool, ValidatorTool } = require("../../utils");
const { MODE } = require("../../config/env");

class SecurityMiddleware {
  static decryption(req, res, next) {
    try {
      const { msg } = req.body;
      const { error } = ValidatorTool.cryptingValidator().validate(req.body);

      if (error) {
        console.log(error.details);
        return ResponseHandler.error(res, error.message, {}, 401);
      }

      //  implement decrypting
      const decryptedData = CryptingTool.decrypt(msg);
      const parsedDataDecrypted = JSON.parse(decryptedData);

      req.decryptedData = parsedDataDecrypted;

      next();
    } catch (error) {
      console.log("error", error.message);
      return ResponseHandler.error(res, "Internal Server Error");
    }
  }

  static modeChecker(req, res, next) {
    try {
      req.bodyRequest = MODE === "production" ? req.decryptedData : req.body;

      next();
    } catch (error) {
      console.log("error", error.message);
      return ResponseHandler.error(res, "internal server error");
    }
  }
}

module.exports = SecurityMiddleware;
