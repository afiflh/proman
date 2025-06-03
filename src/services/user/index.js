const { UserModel } = require("../../models");
const { ResponseHandler, createLog, CustomError } = require("../../utils");
const bcrypt = require("bcrypt");
const { dateNow } = require("../../utils/dateTime");
const DateFormatter = require("../../utils/dateTime");
const { filter } = require("lodash");
const { ALLOWED_EMAIL_PREFIX } = require('../../config/env')

const User = new UserModel();

class UserService {
    static async provideGetByTag(userTag) {
        const decodedUsertag = decodeURIComponent(userTag);
        const regex = /@\["([^"]+)"\]/;

        const match = decodedUsertag.match(regex);
        const finalUsername = match ? match[1] : null;

        let datas = await User.findByQueryName(finalUsername);
        datas = datas.map((data) => {
            return {
                id: data.id,
                name: data.name,
            };
        });

        return datas;
    }

    static async provideGetAll() {
        const dataUsers = await User.findAll();

        const formatedData = dataUsers.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                last_login: user.last_login ? DateFormatter.formatDate(user.last_login) : "",
                last_logout: user.last_logout ? DateFormatter.formatDate(user.last_logout) : "",
                is_login: user.is_login !== "0" ? "online" : "offline",
                is_active: user.is_active !== "1" ? "blocked" : "active",
                created_by: user.created_by,
                created_by_name: user.created_by_name,
                created_at: user.created_time ? DateFormatter.formatDate(user.created_time) : "",
            };
        });

        return formatedData;
    }

    static async provideStore(bodyRequest, AuthUser) {
        const existedDataById = await User.findById(bodyRequest.id);
        if (existedDataById) {
            throw new CustomError("failed insert, data is existed", 400)
        }
        const existedDataByName = await User.findByName(bodyRequest.name);
        if (existedDataByName) {
            throw new CustomError("failed insert, data is existed", 400)
        }

        // const allowedEmailPrefix = ALLOWED_EMAIL_PREFIX.split('|');
        // if (!allowedEmailPrefix.includes(bodyRequest.email.split('@')[1])) {
        //     throw new CustomError("failed insert, email prefix is not allowed", 400)
        // }

        const getFirstName = bodyRequest.name.split(" ")[0].toLowerCase();
        const saltRounds = 10;
        const stringSecretKey = `${getFirstName}12345`;
        const hashedSecretKey = await bcrypt.hash(stringSecretKey, saltRounds);

        const inputRequest = {
            id: bodyRequest.id,
            name: bodyRequest.name,
            email: bodyRequest.email,
            phone_number: bodyRequest.phone_number,
            secret_key: hashedSecretKey,
            group_id: bodyRequest.group_id,
            last_login: null,
            last_logout: null,
            is_login: "0",
            is_active: bodyRequest.is_active,
            created_by: bodyRequest.created_by,
            created_time: DateFormatter.dateNow(),
            failed_attempt: 0,
        };

        const insertData = await User.create(inputRequest);
        console.log("[INFO]: insert new user data: ", insertData);

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Menambahkan data baru ke tabel User: ${inputRequest.id}`
        );
    }

    static async provideUpdate(bodyRequest, userId, AuthUser) {
        const prevData = await User.findById(userId);
        if (!prevData) {
            throw new CustomError("data not found", 400)
        }

        const currentDate = dateNow();
        const inputRequest = {
            id: userId,
            // name: bodyRequest.name ?? prevData.name,
            email: bodyRequest.email ?? prevData.email,
            phone_number: bodyRequest.phone_number ?? prevData.phone_number,
            is_active: bodyRequest.is_active ?? prevData.is_active,
            group_id: bodyRequest.group_id ?? prevData.group_id,
            updated_by: bodyRequest.updated_by ?? prevData.updated_by,
            updated_time: currentDate,
        };

        await User.update(inputRequest);

        // Create activity log data <-
        const createLogs = await createLog(AuthUser.id, `Memperbarui data di tabel User: ${userId}`);
    }

    static async provideGetAllWithGroup() {
        const dataUser = await User.findAllWithGroup();

        const formattedData = dataUser.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            group_id: user.group_id,
            group_name: user.group_name,
            last_login: user.last_login ? DateFormatter.formatDate(user.last_login) : "",
            last_logout: user.last_logout ? DateFormatter.formatDate(user.last_logout) : "",
            is_login: user.is_login,
            is_active: user.is_active,
            created_by: user.created_by,
            created_by_name: user.created_by_name,
            created_time: user.created_time ? DateFormatter.formatDate(user.created_time) : "",
        }));

        return formattedData;
    }

    static async provideUpdatePassword(userId, AuthUser) {
        const prevData = await User.findById(userId);
        if (!prevData) {
            throw new CustomError("data not found", 400)
        }

        // Generate password otomatis menggunakan nama awal dan angka 12345
        const firstName = prevData.name.split(" ")[0].toLowerCase();
        const generatedPassword = `${firstName}12345`;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

        const currentDate = dateNow();
        const inputRequest = {
            id: userId,
            secret_key: hashedPassword,
            updated_by: userId ?? prevData.updated_by,
            updated_time: currentDate,
        };

        await User.updatePassword(inputRequest);

        // Create activity log data
        const createLogs = await createLog(
            AuthUser.id,
            `Memperbarui secret_key di tabel User: ${userId}`
        );
    }

    static async provideEditProfile(bodyRequest, userId, AuthUser) {
        const prevData = await User.findById(userId);
        if (!prevData) {
            throw new CustomError("data not found", 400);
        }

        console.log('body request', bodyRequest);


        if (bodyRequest.new_password && bodyRequest.new_password != "" && bodyRequest.new_password !== bodyRequest.retype_password) {
            throw new CustomError("Passwords do not match", 400);
        }

        let hashedPassword = null;
        if (bodyRequest.new_password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(bodyRequest.new_password, saltRounds);
        }

        const inputRequest = {
            id: userId,
            email: bodyRequest.email ?? prevData.email,
            phone_number: bodyRequest.phone_number ?? prevData.phone_number,
            secret_key: hashedPassword ?? prevData.secret_key,
        };
        await User.editProfile(inputRequest);

        const createLogs = await createLog(
            AuthUser.id,
            `Memperbarui data di tabel User: ${userId}`
        );
    }
}

module.exports = UserService;