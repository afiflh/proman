const { GroupModel } = require("../../models");
const { ResponseHandler, createLog, CustomError } = require("../../utils");
const DateFormatter = require("../../utils/dateTime");
const { MODE } = require("../../config/env");

const Group = new GroupModel();

class GroupService {
    static async provideGetAll() {
        let groups = await Group.findAll();
        groups = groups.map((group) => {
            return {
                id: group.id,
                description: group.description,
                is_active: group.is_active,
                menu_list: group.menu_list,
                created_by: group.created_by,
                created_by_name: group.created_by_name,
                created_time: group.created_time ? DateFormatter.formatDate(group.created_time) : "",
                updated_by: group.updated_by,
                updated_by_name: group.updated_by_name,
                updated_time: group.updated_time ? DateFormatter.formatDate(group.updated_time) : "",
            };
        });

        return groups;
    }

    static async provideStore(bodyRequest, AuthUser) {
        const existedData = await Group.findById(bodyRequest.id);

        if (existedData) {
            throw new CustomError(`failed insert, data is existed`, 400)
        }

        const result = await Group.create(bodyRequest);

        const createLogs = await createLog(
            AuthUser.id,
            `Menambahkan data baru ke tabel Group: ${bodyRequest.id}`
        );
    }

    static async provideUpdate(bodyRequest, groupId, AuthUser) {
        if (!groupId) {
            throw new CustomError("parameter undefined", 400);
        }

        const prevData = await Group.findById(groupId);
        if (!prevData) {
            throw new CustomError('data not found', 400);
        }

        const inputRequest = {
            group_id: groupId,
            description: bodyRequest.description ?? prevData.description,
            menu_list: bodyRequest.menu_list ?? prevData.menu_list,
            is_active: bodyRequest.is_active ?? prevData.is_active,
            updated_by: bodyRequest.updated_by ?? prevData.updated_by,
        };

        const dateUpdated = await Group.update(inputRequest);

        const createLogs = await createLog(
            AuthUser.id,
            `Memperbarui data di tabel Group: ${groupId}`
        );
    }

    static async provideGetAllDropdown() {
        let groups = await Group.findAllDropdown();
        groups = groups.map((group) => {
            return {
                id: group.id,
                description: group.description,
            };
        });

        return groups;
    }
}

module.exports = GroupService;