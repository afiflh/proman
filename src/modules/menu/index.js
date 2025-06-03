const { ResponseHandler } = require("../../utils");
const { MenuService: Service } = require('../../services');


class MenuModule {
  static async getAll(req, res, next) {
    try {

      const result = await Service.provideGetAll();

      return ResponseHandler.success(req, res, "Success", result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = MenuModule;
