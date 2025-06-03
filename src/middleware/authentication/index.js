const { UserModel } = require("../../models");
const { ResponseHandler, verifyToken, CryptingTool } = require("../../utils");

const User = new UserModel();

class AuthenticationMiddleware {
  static async auth(req, res, next) {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      return ResponseHandler.error(res, "credentials mandatory", "", 401);
    }
    let [bearer, token] = bearerToken.split(" ");

    if (bearer !== "Bearer" || !token) {
      return ResponseHandler.error(res, "Invalid token format", "", 401);
    }

    if (!token) {
      return ResponseHandler.error(res, "No token provided", "", 401);
    }
    try {
      const decodedJwt = verifyToken(token, process.env.JWT_SECRET);

      const decryptedPayload = CryptingTool.decrypt(decodedJwt.payload);
      const parsedPayload = JSON.parse(decryptedPayload);

      const userLoggedIn = await User.findUserLoggedIn(parsedPayload.id)
      if (userLoggedIn.is_login == '1' && userLoggedIn.device_id != parsedPayload.device_id) {
        return ResponseHandler.error(res, 'user has already logged in from another device', '', 409);
      }

      req.userData = parsedPayload;
      next();
    } catch (error) {
      console.log(error);
      return ResponseHandler.error(res, error.message ?? "internal server error", error, 401);
    }
  }
}

module.exports = AuthenticationMiddleware;
