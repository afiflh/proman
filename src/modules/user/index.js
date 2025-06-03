const { UserModel } = require("../../models");
const { ResponseHandler, createLog, CustomError } = require("../../utils");
const bcrypt = require("bcrypt");
const { dateNow } = require("../../utils/dateTime");
const DateFormatter = require("../../utils/dateTime");
const { filter } = require("lodash");

// model initiate
const User = new UserModel();

const { UserService: Service } = require('../../services');

class UserModule {
  static async getByTag(req, res, next) {
    try {
      const { usertag } = req.query;
      const result = await Service.provideGetByTag(usertag);
      return ResponseHandler.success(req, res, "success get data users", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const result = await Service.provideGetAll();
      ResponseHandler.success(req, res, "success", result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async store(req, res, next) {
    try {
      const { bodyRequest } = req;
      const AuthUser = req.userData;
      const execution = await Service.provideStore(bodyRequest, AuthUser);
      return ResponseHandler.success(req, res, "success insert new user", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const userId = req.params.id;
      const { bodyRequest } = req;
      const AuthUser = req.userData;
      const execution = await Service.provideUpdate(bodyRequest, userId, AuthUser);
      return ResponseHandler.success(req, res, "success edit user data", {});
    } catch (error) {
      return next(error);
    }
  }

  static async getAllWithGroup(req, res, next) {
    try {
      const result = await Service.provideGetAllWithGroup();
      return ResponseHandler.success(req, res, "Success", result);
    } catch (error) {
      return next(error);
    }
  }

  static async updatePassword(req, res, next) {
    try {
      const userId = req.params.id;
      const AuthUser = req.userData;
      const execution = await Service.provideUpdatePassword(userId, AuthUser);
      return ResponseHandler.success(req, res, "success reset password data", {}, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async editProfile(req, res, next) {
    try {
      const userId = req.params.id;
      const { bodyRequest } = req;
      
      const AuthUser = req.userData;
      const execution = await Service.provideEditProfile(bodyRequest, userId, AuthUser);
      return ResponseHandler.success(req, res, "success edit profile data", {});
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UserModule;
