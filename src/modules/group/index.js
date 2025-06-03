const { ResponseHandler } = require("../../utils");
const { GroupService: Service } = require('../../services');

class GroupModule {
  static async getAll(req, res, next) {
    try {

      const result = await Service.provideGetAll();

      return ResponseHandler.success(req, res, "success", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async store(req, res, next) {
    try {

      const { bodyRequest } = req;
      const AuthUser = req.userData;

      const execution = await Service.provideStore(bodyRequest, AuthUser);

      return ResponseHandler.success(req, res, "success insert new data group", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { bodyRequest } = req;
      const group_id = req.params.id;
      const AuthUser = req.userData;

      const execution = await Service.provideUpdate(bodyRequest, group_id, AuthUser);

      ResponseHandler.success(req, res, "success update data group", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getAllDropdown(req, res, next) {
    try {

      const result = await Service.provideGetAllDropdown();

      return ResponseHandler.success(req, res, "success", result, 200);
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = GroupModule;
