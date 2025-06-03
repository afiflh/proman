const { CommentsModel, TaskListModel, SubtasklistModel, ProjectAssigneeModel, ProjectAssignmentModel, UserModel } = require('../../models');
const { ResponseHandler, sendEmail, sendWhatsAppMessage, logger, CustomError } = require("../../utils");
const { generateUuid } = require("../../utils/uuidGenerator");

const Comment = new CommentsModel();
const Tasklist = new TaskListModel();
const Subtasklist = new SubtasklistModel();
const ProjectAssignment = new ProjectAssignmentModel();
const User = new UserModel();

class CommentService {

    static async provideGetUserTagged(projectId) {
        let datas = await ProjectAssignment.findByProjectId(projectId);
        datas = datas.map(item => {
            return {
                id: item.id,
                name: item.name,
                email: item.email
            }
        });

        return datas
    }

    static async provideStore(bodyRequest) {
        // Mengecek ketersediaan data tasklist
        const existedTasklist = await Tasklist.findCode(bodyRequest.tasklist_id);
        if (existedTasklist === null) {
            throw new CustomError('tasklist data not found', 400);
        }

        // Pengecekan apakah comment berupa tasklist atau subtasklist
        if ((bodyRequest.comment_mode === 'tasklist' && bodyRequest.subtasklist_id) || (bodyRequest.comment_mode === 'subtasklist' && !bodyRequest.subtasklist_id)) {
            throw new CustomError('invalid input request', 400);
        }

        // Mengecek apakah comment memiliki tag @["email"]
        const regex = /@\["([^\"]+)"\]/g;
        let match;
        let foundedSocmed = [];
        let usernameTagged = [];
        while ((match = regex.exec(bodyRequest.comment)) !== null) {
            const userTagged = await User.findByEmail(match[1]);
            foundedSocmed.push({
                email: match[1],
                phone_number: userTagged.phone_number ?? null
            });
            if (userTagged !== null) {
                usernameTagged.push(userTagged.name);
            }
        }

        // Pemformatan pesan comment yang akan di masukkan ke database
        const regexFormatComment = /@\["(.*?)"\]/g;
        let index = 0;
        const formattedComment = bodyRequest.comment.replace(regexFormatComment, (match, email) => {
            if (index < usernameTagged.length) {
                return `@${usernameTagged[index++]}`
            }
            return match;
        })

        const inputRequest = {
            id: generateUuid(),
            tasklist_id: bodyRequest.tasklist_id,
            subtasklist_id: bodyRequest.subtasklist_id ?? null,
            comment: formattedComment,
            comment_mode: bodyRequest.comment_mode,
            created_by: bodyRequest.created_by,
        };
        const storeExecution = await Comment.create(inputRequest);

        // Mengirim pesan WhatsApp dan Email ke pengguna yang telah di tag
        for (const item of foundedSocmed) {
            if (item.phone_number !== null) {
                try {
                    const responseWhatsappSend = await sendWhatsAppMessage({
                        phone: item.phone_number,
                        message: '*You were tagged in a comment* from *Project Management App:* \n\n' +
                            `*Tasklist ID:* ${existedTasklist.kode}\n*Tasklist Title:* ${existedTasklist.title}\n*Tasklist Status:* ${existedTasklist.status_id}\n\n*Comment:*${formattedComment}`
                    });
                    if (responseWhatsappSend.statusCode !== 200) {
                        console.log('[INFO]: There was some error while sending WhatsApp to ', item.phone_number);
                    } else {
                        console.log('[INFO]: Succeed send WhatsApp to ', item.phone_number);
                    }
                } catch (error) {
                    console.error('[ERROR]: Failed to send WhatsApp to', item.phone_number, error);
                }
            }

            try {
                const responseEmailSend = await sendEmail({ email: item.email, subject: "Tagged Comment", message: ` <b>You were tagged in a comment</b> from <b>Project Management App:</b> <br><br> <b>Tasklist ID:</b> ${existedTasklist.kode}<br> <b>Tasklist Title:</b> ${existedTasklist.title}<br> <b>Tasklist Status:</b> ${existedTasklist.status_id}<br><br> <b>Comment:</b><br>${formattedComment} ` });
                if (responseEmailSend.statusCode !== 200) {
                    console.log('[INFO]: There was some error while sending email to ', item.email);
                } else {
                    console.log('[INFO]: Succeed send email to ', item.email);
                }
            } catch (error) {
                console.error('[ERROR]: Failed to send email to', item.email, error);
            }
        }
    }

    static async ProvideGetByParams(identifier, mode) {
        // Mengecek apakah mode adalah tasklist atau subtasklist
        if (mode != 'tasklist' && mode != 'subtasklist') {
            throw new CustomError('failed get data, unknown mode params', 400);
        }

        // Mengecek apakah tasklist atau subtasklist ada
        const existedTask = mode === 'tasklist'
            ? await Tasklist.findCode(identifier)
            : await Subtasklist.findById(identifier);
        if (existedTask === null) {
            throw new CustomError(`failed get data, ${mode} not found`, 400);
        }

        // Mengambil data dari tabel comment
        let datas = await Comment.findByParams(identifier, mode);
        datas = datas.length > 0 ? datas.map(item => {
            return {
                id: item.id,
                tasklist_id: item.tasklist_id,
                subtasklist_id: item.subtasklist_id,
                comment: item.comment,
                comment_mode: item.comment_mode,
                user_sender: {
                    id: item.sender_id,
                    name: item.sender_name
                },
                created_time: item.created_time
            }
        }) : [];

        return datas;
    }

    static async provideGetByTasklist(tasklistId) {
        let datas = await Comment.findByTasklist(tasklistId);
        datas = datas.length > 0 ? datas.map(item => {
            return {
                id: item.id,
                tasklist_id: item.tasklist_id,
                subtasklist_id: item.subtasklist_id,
                comment: item.comment,
                comment_mode: item.comment_mode,
                user_sender: {
                    id: item.sender_id,
                    name: item.sender_name
                },
                created_time: item.created_time
            }
        }) : [];

        return datas;
    }

    static async provideGetBySubtasklist(subtasklistId) {
        let datas = await Comment.findBySubtasklist(subtasklistId);
        datas = datas.length > 0 ? datas.map(item => {
            return {
                id: item.id,
                tasklist_id: item.tasklist_id,
                subtasklist_id: item.subtasklist_id,
                comment: item.comment,
                comment_mode: item.comment_mode,
                user_sender: {
                    id: item.sender_id,
                    name: item.sender_name
                },
                created_time: item.created_time
            }
        }) : [];

        return datas;
    }
}

module.exports = CommentService;
