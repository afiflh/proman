const { ResponseHandler } = require("../../utils");

const { ProjectAssigneeService: Service } = require('../../services');

class ProjectAssigneeModule {
  static async getAll(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await Service.provideGetAll(userId);
      return ResponseHandler.success(req, res, "success fetch data", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getBoardData(req, res, next) {
    try {
      const { projectId } = req.params;
      const { assigneesId } = req.query;
      const decodedFilter = decodeURIComponent(assigneesId);
      const filterAsigneesName = assigneesId ? decodedFilter : null;

      const result = await Service.provideGetBoardData(projectId, filterAsigneesName);

      return ResponseHandler.success(req, res, "success fetching data boards", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getBoardDataByTopProject(req, res, next) {
    try {
      const { userData } = req;
      const result = await Service.provideGetBoardDataByTopProject(userData);
      return ResponseHandler.success(req, res, result.message, result.data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getAssigneeByProject(req, res, next) {
    try {
      const { projectId } = req.params;

      const result = await Service.provideGetAssigneeByProject(projectId);

      return ResponseHandler.success(req, res, "success fetch data", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { kode } = req.params;
      const { bodyRequest } = req;
      const AuthUser = req.userData;

      const execution = await Service.provideUpdateStatus(bodyRequest, kode, AuthUser);

      ResponseHandler.success(req, res, "Success update tasklist status!", {}, 200);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ProjectAssigneeModule;
