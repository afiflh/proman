const { ResponseHandler } = require("../../utils");
const { TasklistService: Service } = require('../../services')

class TaskListModule {
  static async getDetail(req, res, next) {
    try {
      const { tasklistcode } = req.params;
      const result = await Service.provideGetDetail(tasklistcode);
      console.log(result);

      return ResponseHandler.success(req, res, "success fetching data", result, 200);
    } catch (error) {
      return next(error);
    }
  }


  static async getAll(req, res, next) {
    try {
      const { user_id } = req.query;
      const result = await Service.provideGetAll(user_id);
      ResponseHandler.success(req, res, "success fetching task list data", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getByProjectId(req, res, next) {
    try {
      const { project_id } = req.params;
      const result = await Service.provideGetByProjectById(project_id);
      ResponseHandler.success(req, res, "success fetching task list data", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  // upload gambar ke endpoint gambar -> masuk ke route upload gambar
  static async store(req, res, next) {
    try {
      const { bodyRequest } = req;
      const AuthUser = req.userData;
      const execution = await Service.provideStore(bodyRequest, AuthUser);
      return ResponseHandler.success(req, res, "Success creating new tasklist data", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const kode = req.params.kode;
      const { bodyRequest } = req;
      const AuthUser = req.userData;
      const execution = await Service.provideUpdate(bodyRequest, kode, AuthUser);
      ResponseHandler.success(req, res, "success update tasklist data", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateAssignee(req, res, next) {
    try {
      const kode = req.params.kode;
      const { bodyRequest } = req;
      const AuthUser = req.userData;
      const execution = await Service.provideUpdateAssignee(bodyRequest, kode, AuthUser);
      ResponseHandler.success(req, res, "success update tasklist assignee", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = TaskListModule;
