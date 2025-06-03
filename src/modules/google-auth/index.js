
const { GoogleAuthService: Service } = require('../../services')
const { google } = require('googleapis');
const { CustomError, ResponseHandler, CryptingTool } = require('../../utils');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, FRONTEND_URL } = require('../../config/env');

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
];

class GoogleAuthModule {
    static async redirectConsent(req, res, next) {
        try {
            const authorizationUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
            });

            return res.redirect(authorizationUrl);
        } catch (error) {
            return next(error);
        }
    }

    static async callbackAuth(req, res, next) {
        try {
            const { code } = req.query;
            const { tokens } = await oauth2Client.getToken(code.toString());

            oauth2Client.setCredentials(tokens);
            const oauth2 = google.oauth2({
                auth: oauth2Client,
                version: 'v2',
            });
            const { data } = await oauth2.userinfo.get();
            if (!data.email || !data.name) {
                return next(new CustomError('Invalid google account', 401));
            }

            const resultCheck = await Service.provideCheckUserV2(data, req.ip);

            if (resultCheck.status === 'error-login') {
                res.cookie('error_message', CryptingTool.encrypt(resultCheck.message), {
                    httpOnly: false,
                    secure: false,
                    maxAge: 60 * 1000, // 1 menit
                    encode: String
                })

                if (resultCheck.type == 'conflict-user-1') {
                    res.cookie('user_req_login', CryptingTool.encrypt(JSON.stringify({
                        user_id: resultCheck.current_user_id,
                        device_id: resultCheck.current_device_id
                    })), {
                        httpOnly: false,
                        secure: false,
                        maxAge: 60 * 1000, // 1 menit
                        encode: String
                    })
                }

                return res.redirect(`${FRONTEND_URL}/auth/login`)
            }


            if (resultCheck.data.token && resultCheck.data.token !== null) {
                res.cookie('TOKEN', resultCheck.data.token, {
                    httpOnly: false,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000, // 1 hari
                    encode: String
                });

                res.cookie('USER_ID', CryptingTool.encrypt(resultCheck.data.user_id), {
                    httpOnly: false,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000, // 1 hari
                    encode: String
                });

                res.cookie('NAME', CryptingTool.encrypt(resultCheck.data.name), {
                    httpOnly: false,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000, // 1 hari
                    encode: String
                });

                res.cookie('GROUP_ID', CryptingTool.encrypt(resultCheck.data.group_id), {
                    httpOnly: false,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000, // 1 hari
                    encode: String
                });

                res.cookie('GROUP_NAME', CryptingTool.encrypt(resultCheck.data.group_name), {
                    httpOnly: false,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000, // 1 hari
                    encode: String
                });

                res.cookie('MENU_LIST', CryptingTool.encrypt(JSON.stringify(resultCheck.data.menu_list)), {
                    httpOnly: false,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000, // 1 hari
                    encode: String
                });

                res.cookie('EMAIL', CryptingTool.encrypt(resultCheck.data.user_email), {
                    httpOnly: false,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000, // 1 hari
                    encode: String
                });

                res.cookie('PHONE_NUMBER', CryptingTool.encrypt(resultCheck.data.user_phone_number), {
                    httpOnly: false,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000, // 1 hari
                    encode: String
                });

                if (resultCheck.data.user_forgot_password) {
                    res.cookie('user_forgot_password', CryptingTool.encrypt('true'), {
                        httpOnly: false,
                        secure: false,
                        maxAge: 24 * 60 * 60 * 1000, // 1 hari
                        encode: String
                    })
                }

                return res.redirect(`${FRONTEND_URL}/dashboard/home`)
            }

            return ResponseHandler.success(req, res, resultCheck.message, resultCheck.data, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async register(req, res, next) {
        try {
            const { bodyRequest } = req;
            const resultCheck = await Service.provideRegisterUser(bodyRequest, req.ip);
            return ResponseHandler.success(req, res, resultCheck.message, resultCheck.data, 200);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = GoogleAuthModule;