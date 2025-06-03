const { ParameterModel, ProjectModel } = require("../../models");
const { ResponseHandler, CustomError } = require("../../utils");

const Parameter = new ParameterModel();
const Project = new ProjectModel();

const { ParameterService: Service } = require('../../services');

class ParameterModule {
  static async getAll(req, res, next) {
    try {
      const result = await Service.provideGetAll();

      ResponseHandler.success(req, res, "succes get data parameter", result, 200);
    } catch (error) {
      return next(error)
    }
  }

  static async getAllProjectType(req, res, next) {
    try {
      const result = await Service.provideGetAllProjectType();

      ResponseHandler.success(req, res, "succes get data parameter", result, 200);
    } catch (error) {
      return next(error)
    }
  }

  static async getAllProjectStatus(req, res, next) {
    try {
      const result = await Service.provideGetAllProjectStatus();
      return ResponseHandler.success(req, res, "succes get data parameter", result, 200);
    } catch (error) {
      return next(error)
    }
  }

  static async store(req, res, next) {
    try {
      const { bodyRequest } = req;
      const execution = await Service.provideStore(bodyRequest);

      return ResponseHandler.success(req, res, "succes create data parameter", {}, 200);
    } catch (error) {
      return next(error)
    }
  }

  static async edit(req, res, next) {
    try {
      const { bodyRequest } = req;
      const { param_id } = req.params;

      const execution = await Service.provideUpdate(bodyRequest, param_id);

      return ResponseHandler.success(req, res, "succes update data parameter", {}, 200);
    } catch (error) {
      return next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const { param_id } = req.params;

      const execution = await Service.provideDelete(param_id)

      return ResponseHandler.success(req, res, "succes delete data parameter", {}, 200);
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = ParameterModule;
