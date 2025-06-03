const { MODE } = require("../../config/env");
const { CryptingTool } = require("../cryptingTool");
const logger = require("../logger");

class ResponseHandler {
  static success(req, res, message, data, statusCode = 200) {

    const { method, url, ip } = req;

    const bodyResponse = {
      status: "success",
      message,
      data,
    };

    logger.info(`Incoming request: METHOD=${method}, URL=${url}, IP=${ip}`)

    if (MODE === "development") {
      return res.status(statusCode).json(bodyResponse);
    } else {
      const parsedBody = JSON.stringify(bodyResponse);
      const encryptedBody = CryptingTool.encrypt(parsedBody);
      return res.status(statusCode).json({
        msg: encryptedBody,
      });
    }
  }

  static error(res, message, error, statusCode = 500) {
    const bodyResponse = {
      status: "error",
      message,
      error,
    };

    if (MODE === "development") {
      return res.status(statusCode).json(bodyResponse);
    } else {
      const parsedBody = JSON.stringify(bodyResponse);
      const encryptedBody = CryptingTool.encrypt(parsedBody);
      return res.status(statusCode).json({
        msg: encryptedBody,
      });
    }
  }
}

module.exports = ResponseHandler;
