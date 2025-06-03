const { UserModel } = require("../../models");
const { createLog, CryptingTool, generateToken, CustomError, generateRandomPass, sendEmail } = require("../../utils");
const bcrypt = require("bcrypt");
const { dateNow } = require("../../utils/dateTime");
const moment = require('moment');

const User = new UserModel();

class AuthenticationService {
  static MAX_FAILED_ATTEMPT = 3;

  static async _generateJSONAuth(userData, currentIp) {
    // Enkripsi payload JWT
    const payloadJwt = { id: userData.id, name: userData.name, email: userData.email, phone_number: userData.phone_number, device_id: currentIp };
    const encryptedPayload = CryptingTool.encrypt(JSON.stringify(payloadJwt));

    // Generate token JWT
    const newTokenJwt = generateToken({ payload: encryptedPayload });

    // Mengambil data dari tabel Groups
    const groupData = await User.findUserGroup(userData.id);

    // Mengambil data dari tabel menu
    const menuList = await User.getMenuList(groupData.menu_list);

    await createLog(userData.id, `Login berhasil oleh user dengan ID ${userData.id}`);

    let dataResponse = {
      token: newTokenJwt,
      user_id: userData.id,
      name: userData.name,
      group_id: groupData.id,
      group_name: groupData.description,
      menu_list: menuList,
    };

    return dataResponse;
  }

  static async provideLogin({ id, secret_key, currentIp }) {
    // Mencari user yang sudah ada di database
    const existedUser = await User.findById(id);
    if (!existedUser) {
      // Create activity log data <-
      await createLog(
        null,
        `Percobaan login gagal oleh user dengan ID ${id}, kredensial tidak ditemukan`
      );
      throw new CustomError("invalid credentials", 400);
    }

    // Memeriksa status aktivasi user
    if (existedUser.is_active == "0") {
      // Create activity log data <-
      await createLog(null, `Percobaan login gagal oleh user dengan ID ${id}, data user diblokir`);
      throw new CustomError("user account has been blocked", 400);
    }

    // Validasi secret_key (PASSWORD)
    const validateSecretKey = await bcrypt.compare(secret_key, existedUser.secret_key);
    if (!validateSecretKey) {
      const failedAttempt = existedUser.failed_attempt + 1;
      await User.updateFailedAttempt(existedUser.id, failedAttempt);

      if (failedAttempt < this.MAX_FAILED_ATTEMPT) {
        // Create activity log data <-
        await createLog(
          null,
          `Percobaan login gagal oleh user dengan ID ${id}, kredensial tidak ditemukan`
        );

        throw new CustomError(
          `invalid credential. You have ${this.MAX_FAILED_ATTEMPT - failedAttempt} attempts left.`,
          400
        );
      } else {
        await User.updateBlock(existedUser.id);
        // Create activity log data <-
        await createLog(
          null,
          `Percobaan login gagal oleh user dengan ID ${id}, data user diblokir`
        );

        throw new CustomError(
          "User account has been blocked due to multiple failed login attempt",
          400
        );
      }
    }

    // Pengecekan apakah user sudah login di perangkat sebelumnya
    if (existedUser.is_login === "1" && existedUser.device_id != currentIp) {
      await createLog(
        null,
        `Percobaan login gagal oleh user dengan ID ${id}, user telah login di perangkat sebelumnya`
      );
      // return next(new CustomError('user has already logged-in from another device', 409));
      return {
        status: "error",
        current_device_id: currentIp,
        current_user_id: existedUser.id,
        message: "user has already logged-in from another device",
      };
    } else if (existedUser.is_login === "1") {
      await createLog(
        null,
        `Percobaan login gagal oleh user dengan ID ${id}, user telah login di sesi sebelumnya`
      );
      throw new CustomError("user has logged in", 400);
    }

    // Enkripsi payload JWT
    const responseAuth = await this._generateJSONAuth(existedUser, currentIp);

    // Pengecekan apakah user yang saat ini login adalah user yang baru saja request reset password
    if (existedUser.reset_password_token) {
      if ((new Date(dateNow()) > new Date(existedUser.reset_password_token_expires))) {
        throw new CustomError("request password has been expired", 400);
      }
      responseAuth.user_forgot_password = true;
    }

    const lastLogin = dateNow();
    await User.updateLogin("1", lastLogin, existedUser.id, currentIp);

    await createLog(existedUser.id, `Login berhasil oleh user dengan ID ${id}`);

    return responseAuth;
  }

  static async provideConfirmLogin({ user_id, device_id }) {
    const existedUser = await User.findById(user_id);
    if (!existedUser) {
      throw new CustomError("user not found", 400);
    }

    // Enkripsi payload JWT
    const payloadJwt = { id: existedUser.id, name: existedUser.name, device_id };
    const encryptedPayload = CryptingTool.encrypt(JSON.stringify(payloadJwt));

    // Generate token JWT
    const newTokenJwt = generateToken({ payload: encryptedPayload });

    // Mengambil data dari tabel Groups
    const groupData = await User.findByCredentials(existedUser.id, existedUser.secret_key);

    // Mengambil data dari tabel menu
    const menuList = await User.getMenuList(groupData.menu_list);

    // Update informasi login untuk user yang sekarang di perangkat baru
    const lastLogin = dateNow();
    await User.updateLogin("1", lastLogin, existedUser.id, device_id);

    return {
      token: newTokenJwt,
      user_id: existedUser.id,
      name: existedUser.name,
      group_id: groupData.id,
      group_name: groupData.description,
      menu_list: menuList,
    };
  }

  static async provideLogout(authUser) {
    await User.updateLogout(authUser.id);

    // Create activity log data <-
    const createLogs = await createLog(authUser.id, `Logout berhasil oleh user ${authUser.name}`);

    return {};
  }

  static async provideSendEmailForgotPassword(userEmail) {
    const existedUser = await User.findByEmail(userEmail);
    if (!existedUser) {
      throw new CustomError("user not registered in the system", 400);
    }

    const newRandomPassword = generateRandomPass(8);
    const saltRounds = 10;
    const stringPassword = newRandomPassword;
    const hashedPassword = await bcrypt.hash(stringPassword, saltRounds);

    const updateResetPassUser = await User.updateResetPasswordToken(hashedPassword, userEmail);

    const sendingEmail = await sendEmail({
      email: userEmail,
      subject: `${existedUser.name} - Reset Password`,
      message: `
        <p>Hello ${existedUser.name},</p>
        <p>We have received a request to reset your password. Please login to your account with below temporary password</p>
        Your temporary password: <Strong>${newRandomPassword}</Strong>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you,</p>
        <p>Project Management Developer</p>
        `
    })

    if (sendingEmail.statusCode == 200) {
      return {
        message: 'Success send email to user',
        data: {
          statusCodeEmail: sendingEmail.statusCode,
        }
      }
    } else {
      throw new CustomError('Error send email to user', 400);
    }
  }

  static async provideUpdateForgotPassword(bodyRequest) {

    const existedUser = await User.findById(bodyRequest.id);
    if (!existedUser) { throw new CustomError('User not found', 404) }

    const validateTempPassword = await bcrypt.compare(bodyRequest.temporary_password, existedUser.reset_password_token);
    if (!validateTempPassword) {
      throw new CustomError('failed update password, temporary password is false!', 400);
    }

    const hashedNewPassword = await bcrypt.hash(bodyRequest.new_password, 10);

    await User.updateForgotPassword(bodyRequest.id, hashedNewPassword);

  }


}

module.exports = AuthenticationService;
