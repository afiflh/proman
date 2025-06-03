const { ResponseHandler } = require("../../utils");

const { ProjectService: Service } = require('../../services');

class ProjectModule {

  static async getUnassignedProjects(req, res, next) {
    try {
      const result = await Service.provideGetUnassignedProjects();
      ResponseHandler.success(req, res, 'Success get unassigned projects', result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async store(req, res, next) {
    try {
      const { bodyRequest } = req;
      const AuthUser = req.userData;

      const execution = await Service.provideStore(bodyRequest, AuthUser);

      ResponseHandler.success(req, res, "success create new data", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const result = await Service.provideGetAll();
      console.log("result get all data: ", result);
      ResponseHandler.success(req, res, "success get all data project", result, 200);
    } catch (error) {
      console.error("error get all data: ", error);
      next(error);
    }
  }

  static async getProjectWithMostTodoTasks(req, res, next) {
    try {
      const result = await Service.provideGetProjectWithMostTodoTasks();
      ResponseHandler.success(req, res, "success get project with most todo tasks", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { bodyRequest } = req;
      const AuthUser = req.userData;

      const execution = await Service.provideUpdate(bodyRequest, id, AuthUser);

      ResponseHandler.success(req, res, "success edit project data", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const AuthUser = req.userData;

      const execution = await Service.provideDelete(id, AuthUser);

      ResponseHandler.success(req, res, "success delete data", {}, 200);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ProjectModule;
