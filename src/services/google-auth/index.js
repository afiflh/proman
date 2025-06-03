const { google } = require('googleapis');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../../config/env');
const AuthenticationService = require('../authentication');
const { UserModel } = require('../../models');
const { CryptingTool, generateToken, createLog, CustomError, DateFormatter, generateDefaultPassword } = require('../../utils');
const { dateNow } = require('../../utils/dateTime');
const bcrypt = require('bcrypt');

const User = new UserModel();

class GoogleAuthService extends AuthenticationService {
    static async provideCheckUser(googleUserData, currentIp) {
        const existedUser = await User.findByEmail(googleUserData.email);
        if (!existedUser) {
            const inputNewUser = {
                id: googleUserData.email,
                name: googleUserData.name,
                group_id: 'NEW_USER',
                is_active: '1',
                created_by: 'SYSTEM_APP',
                created_time: DateFormatter.dateNow(),
                failed_attempt: 0,
                email: googleUserData.email,
            }

            await User.createDirect(inputNewUser);

            const newRegisteredUser = await User.findByEmail(inputNewUser.email);

            const responseAuth = await this._generateJSONAuth(newRegisteredUser, currentIp);

            if (newRegisteredUser.secret_key === null) {
                responseAuth.unregistered_flag = true;
            }

            const lastLogin = dateNow();
            await User.updateLogin("1", lastLogin, newRegisteredUser.id, currentIp);

            return {
                message: 'Success login',
                data: { ...responseAuth }
            };
        }

        // Pengecekan apakah user sudah login di perangkat sebelumnya
        if (existedUser.is_login === "1" && existedUser.device_id != currentIp) {
            // await createLog(
            //     null,
            //     `Percobaan login gagal oleh user dengan ID ${id}, user telah login di perangkat sebelumnya`
            // );
            // return next(new CustomError('user has already logged-in from another device', 409));
            return {
                status: "error-conflict-user",
                current_device_id: currentIp,
                current_user_id: existedUser.id,
                message: "user has already logged in from another device",
            };
        } else if (existedUser.is_login === "1") {
            // await createLog(
            //     null,
            //     `Percobaan login gagal oleh user dengan ID ${id}, user telah login di sesi sebelumnya`
            // );
            throw new CustomError("user has logged in", 400);
        }

        const responseAuth = await this._generateJSONAuth(existedUser, currentIp);

        if (existedUser.secret_key === null) {
            responseAuth.unregistered_flag = true;
        }

        if (existedUser.reset_password_token) {
            if ((new Date(dateNow()) > new Date(existedUser.reset_password_token_expires))) {
                throw new CustomError("request password has been expired", 400);
            }
            responseAuth.user_forgot_password = true;
        }

        const lastLogin = dateNow();
        await User.updateLogin("1", lastLogin, existedUser.id, currentIp);

        return {
            message: 'Success login',
            data: { ...responseAuth }
        };
    }

    static async provideCheckUserV2(googleUserData, currentIp) {
        const existedUser = await User.findByEmail(googleUserData.email);
        if (!existedUser) {
            return {
                status: 'error-login',
                message: 'Failed login, email not registered',
                data: {}
            };
        }

        // Pengecekan apakah user sudah login di perangkat sebelumnya
        if (existedUser.is_login === "1" && existedUser.device_id != currentIp) {
            await createLog(
                googleUserData.id,
                `Percobaan login gagal oleh user dengan ID ${googleUserData.id}, user telah login di perangkat sebelumnya`
            );
            return {
                status: "error-login",
                type: 'conflict-user-1',
                current_device_id: currentIp,
                current_user_id: existedUser.id,
                message: "user has already logged in from another device",
            };
        } else if (existedUser.is_login === "1") {
            await createLog(
                googleUserData.id,
                `Percobaan login gagal oleh user dengan ID ${googleUserData.id}, user telah login di sesi sebelumnya`
            );
            return {
                status: 'error-login',
                type: 'conflict-user-2',
                message: "user has logged in",
            }
        }

        const responseAuth = await this._generateJSONAuth(existedUser, currentIp);

        if (existedUser.secret_key === null) {
            responseAuth.unregistered_flag = true;
        }

        if (existedUser.reset_password_token) {
            if ((new Date(dateNow()) > new Date(existedUser.reset_password_token_expires))) {
                await createLog(
                    googleUserData.id,
                    `Percobaan login gagal oleh user dengan ID ${googleUserData.id}, token reset password telah kadaluarsa`
                );
                return {
                    status: 'error-login',
                    type: 'expired-password',
                    message: 'Failed login, password reset expired',
                }
            }
            responseAuth.user_forgot_password = true;
        }

        const lastLogin = dateNow();
        await User.updateLogin("1", lastLogin, existedUser.id, currentIp);

        return {
            message: 'Success login',
            data: { ...responseAuth, user_email: existedUser.email, user_phone_number: existedUser.phone_number }
        };
    }

    static async provideRegisterUser(bodyRequest, currentIp) {
        const existedUser = await User.findByEmail(bodyRequest.email);

        if (!existedUser) {
            throw new CustomError('email not registered', 400);
        }
        // else if (existedUser && existedUser.id === bodyRequest.id) {
        //     throw new CustomError('User ID already registered', 400);
        // }

        if (bodyRequest.password !== bodyRequest.retype_password) {
            throw new CustomError('password and retype password not match', 400);
        }

        const saltRounds = 10;
        const stringPassword = bodyRequest.password;
        const hashedPassword = await bcrypt.hash(stringPassword, saltRounds);

        const inputRequest = {
            // id: bodyRequest.id,
            name: bodyRequest.name,
            email: bodyRequest.email,
            secret_key: hashedPassword,
            phone_number: bodyRequest.phone_number ?? null,
        };

        await User.updateRegistering(inputRequest);

        const createLogs = await createLog(
            'SYSTEM_APP',
            `Menambahkan data baru ke tabel User: ${inputRequest.id}`
        );

        return {
            message: 'success register new user',
            data: {}
        }
        // Jika Login Langsung Diperlukan
        // Enkripsi payload JWT
        // CODE
        // const payloadJwt = { id: inputRequest.id, name: inputRequest.name, device_id: currentIp };
        // const encryptedPayload = CryptingTool.encrypt(JSON.stringify(payloadJwt));

        // // Generate token JWT
        // const newTokenJwt = generateToken({ payload: encryptedPayload });
        // // Mengambil data dari tabel Groups
        // const groupData = await User.findWithGroupById(inputRequest.id);
        // // Mengambil data dari tabel menu
        // const menuList = await User.getMenuList(groupData.menu_list);
        // const lastLogin = dateNow();
        // await User.updateLogin("1", lastLogin, inputRequest.id, currentIp);
        // await createLog(inputRequest.id, `Login berhasil oleh user dengan ID ${inputRequest.id}`);
        // return {
        //     message: 'Success login',
        //     data: {
        //         token: newTokenJwt,
        //         user_id: inputRequest.id,
        //         name: inputRequest.name,
        //         group_id: groupData.id,
        //         group_name: groupData.description,
        //         menu_list: menuList,
        //     }
        // };
        // END-CODE
    }
}


module.exports = GoogleAuthService;