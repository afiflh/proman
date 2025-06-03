const { ResponseHandler } = require("../../utils");
const { AuthenticationService: Service } = require("../../services");

class AuthenticationModule {
  static async login(req, res, next) {
    try {
      const { id, secret_key } = req.bodyRequest;
      const currentIp = req.ip;
      const result = await Service.provideLogin({ id, secret_key, currentIp });
      if (result.status === "error") {
        return res.status(409).json(result);
      }

      return ResponseHandler.success(req, res, "Login successful", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async confirmLogin(req, res, next) {
    try {
      const { user_id, device_id } = req.bodyRequest;
      const result = await Service.provideConfirmLogin({ user_id, device_id });
      return ResponseHandler.success(req, res, "Login successful", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async sendEmailForgotPassword(req, res, next) {
    try {
      const { email } = req.bodyRequest;
      const execution = await Service.provideSendEmailForgotPassword(email);
      return ResponseHandler.success(req, res, execution?.message, {}, execution?.data?.statusCodeEmail);
    } catch (error) {
      return next(error);
    }
  }

  static async resetForgotPassword(req, res, next) {
    try {
      const execution = await Service.provideUpdateForgotPassword(req.bodyRequest);
      return ResponseHandler.success(req, res, 'success update forgotted password', {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const AuthUser = req.userData;
      const result = await Service.provideLogout(AuthUser);
      return ResponseHandler.success(req, res, "logout succesfull", {});
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AuthenticationModule;
