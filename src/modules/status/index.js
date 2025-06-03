const { ResponseHandler } = require("../../utils");

const { StatusService: Service } = require('../../services');

class StatusModule {
  static async getAll(req, res, next) {
    try {
      const result = await Service.provideGetAll();
      ResponseHandler.success(req, res, "success get all status data", result, 200);
    } catch (error) {
      return next(error)
    }
  }

  static async store(req, res, next) {
    try {
      const { bodyRequest } = req;
      const AuthUser = req.userData;

      const execution = await Service.provideStore(bodyRequest, AuthUser);

      ResponseHandler.success(req, res, "success create new status data", {}, 200);
    } catch (error) {
      return next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { bodyRequest } = req;
      const AuthUser = req.userData;

      const execution = await Service.provideUpdate(bodyRequest, id, AuthUser);

      ResponseHandler.success(req, res, "Success edit status data", {}, 200);
    } catch (error) {
      return next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const AuthUser = req.userData;

      const execution = await Service.provideDelete(id, AuthUser);

      ResponseHandler.success(req, res, "success delete status data", {}, 200);
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = StatusModule;
