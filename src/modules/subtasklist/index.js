const { SubtasklistModel, TaskListModel, ProjectStatusModel, UserModel, TimeframeModel } = require("../../models");
const { ResponseHandler, DateFormatter, createLog, CustomError } = require("../../utils");
const generatePadNumber = require("../../utils/generatePadNumber");

const Subtasklist = new SubtasklistModel();
const Tasklist = new TaskListModel();
const ProjectStatus = new ProjectStatusModel();
const User = new UserModel();
const Timeframe = new TimeframeModel();

const { SubtasklistService: Service } = require('../../services')


class SubtaskliskModule {
  static async getAll(req, res, next) {
    try {
      let { tasklistCode } = req.params;
      const result = await Service.provideGetAll(tasklistCode);
      return ResponseHandler.success(req, res, "success get data", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async store(req, res, next) {
    try {
      const { bodyRequest } = req;
      const AuthUser = req.userData;
      const execution = await Service.provideStore(bodyRequest, AuthUser);
      return ResponseHandler.success(req, res, "success create new data", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async edit(req, res, next) {
    try {
      const { bodyRequest } = req;
      const AuthUser = req.userData;
      let { subtasklistCode } = req.params;
      subtasklistCode = subtasklistCode.toUpperCase();
      const execution = await Service.provideUpdate(bodyRequest, subtasklistCode, AuthUser);
      return ResponseHandler.success(req, res, "success update data", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async editStatus(req, res, next) {
    try {
      const { subtasklistCode } = req.params;
      const { status_id } = req.bodyRequest;
      const AuthUser = req.userData;
      const execution = await Service.provideUpdateStatus(subtasklistCode, status_id, AuthUser);
      return ResponseHandler.success(req, res, "success update status subtasklist", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async editAssignee(req, res, next) {
    try {
      const { subtasklistCode } = req.params;
      const { assignee } = req.bodyRequest;
      const AuthUser = req.userData;
      const execution = await Service.provideUpdateAssignee(subtasklistCode, assignee, AuthUser);
      return ResponseHandler.success(req, res, "success update data assignee subtasklist", {}, 200);
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = SubtaskliskModule;
