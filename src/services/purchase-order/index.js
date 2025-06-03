const { update, at } = require('lodash');
const { PurchaseOrderModel, ProjectModel, UserModel, CustomerModel } = require('../../models');
const { ResponseHandler, generateProjectId, createLog, CustomError, sendEmail, sendWhatsAppMessage } = require('../../utils');
const project = require('../project');

const PurchaseOrder = new PurchaseOrderModel();
const Project = new ProjectModel();
const User = new UserModel();
const Customer = new CustomerModel();


class PurchaseOrderService {

    static async provideStore(bodyRequest, AuthUser) {
        const existedPO = await PurchaseOrder.findByNumb(bodyRequest.po_number);
        if (existedPO) {
            throw new CustomError('existed data with same order number', 400);
        }

        const existedProject = await Project.findById(bodyRequest.project_id);
        if (existedProject) {
            throw new CustomError('existed project with same id', 400);
        }

        // console.log(bodyRequest);

        const inputRequest = {
            po_number: bodyRequest.po_number,
            project_id: await generateProjectId(),
            project_name: bodyRequest.project_name,
            customer: bodyRequest.customer_id,
            duration: bodyRequest.duration,
            po_date: bodyRequest.po_date,
            live_date: bodyRequest.live_date,
            project_type: bodyRequest.project_type,
            created_by: bodyRequest.created_by,
            po_description: bodyRequest.po_description,
            attachment: bodyRequest.attachment ?? null,
            notification_receivers: bodyRequest.notification_receivers
        };

        await PurchaseOrder.create(inputRequest);

        // Create activity log
        await createLog(AuthUser.id, `Menambahkan data baru ke tabel Project_Purchase_Orders: ${bodyRequest.po_number}`);

        const customer = await Customer.findById(inputRequest.customer);
        console.log(customer);

        // Send email and WhatsApp notifications
        const userIds = bodyRequest.notification_receivers.split(',');
        const userCreator = await User.findById(bodyRequest.created_by);

        const generateNotificationMessage = (createdById, creatorName, poNumber) => ({
            email: `<h5>New PO Information</h5> <br>
                    <p>A New PO has been submitted by ${userCreator.name}</p>
                    <p>PO Number: ${poNumber}</p>
                    <p>PO Date: ${inputRequest.po_date}</p>
                    <p>Customer: ${customer.name}</p>
                    <p>Project Name: ${inputRequest.project_name}</p>
                    <p>Project Type: ${inputRequest.project_type}</p>
                    <p>Description: ${inputRequest.po_description}</p>
            `,
            whatsapp: `New PO Information\n\nA New PO has been submitted by ${userCreator.name}\nPO Number: ${poNumber}\nPO Date: ${inputRequest.po_date}\nCustomer: ${customer.name}\nProject Name: ${inputRequest.project_name}\nProject Type: ${inputRequest.project_type}\nDescription: ${inputRequest.po_description}`

        });

        const sendNotifications = async (user, message) => {
            if (user.email) {
                const subject = 'New Purchase Order';
                const responseSendEmail = await sendEmail({ subject: `New PO Information ${inputRequest.po_number}`, email: user.email, message: message.email });
                console.log(`[INFO]: Email sent to ${user.email}: ${responseSendEmail.statusCode}`);
            }

            if (user.phone_number) {
                const responseSendWhatsApp = await sendWhatsAppMessage({ message: message.whatsapp, phone: user.phone_number });
                console.log(`[INFO]: WhatsApp sent to ${user.phone_number}: ${responseSendWhatsApp.statusCode}`);
            }
        };

        for (const userId of userIds) {
            const assignedUser = await User.findById(userId);

            if (assignedUser) {
                const messageToAssignedUser = generateNotificationMessage(bodyRequest.created_by, userCreator.name, inputRequest.po_number);
                await sendNotifications(assignedUser, messageToAssignedUser);
            }
        }
    }

    static async provideGetAll() {
        const data = await PurchaseOrder.findAll();
        return data;
    }

    static async provideGetProjectIdandName() {
        const data = await PurchaseOrder.getProjectIdandName();
        const formattedData = data.map(item => ({
            id: item.project_id,
            name: item.project_name,
            duration: item.duration
        }));
        return formattedData;
    }

    static async provideGetPendingProjects() {
        const existData = await Project.findAll();
        const data = await PurchaseOrder.getProjectIdandName();

        // Membuat set dari project names yang sudah ada
        const existingProjectNames = new Set(existData.map(project => project.name));

        // Filter proyek yang tidak ada di existingProjectNames
        const filteredData = data.filter(item => !existingProjectNames.has(item.project_name));

        const formattedData = filteredData.map(item => ({
            id: item.project_id,
            name: item.project_name,
            duration: item.duration
        }));

        return formattedData;
    }

    static async provideDelete(poNumber, AuthUser) {
        const existedPO = await PurchaseOrder.findByNumb(poNumber);
        if (existedPO === null) {
            throw new CustomError('failed delete data, data not found', 400)
        }

        const existedProject = await Project.findById(existedPO.project_id);
        if (existedProject !== null) {
            throw new CustomError('failed delete data, data is still reference to another relations', 400)
        }

        await PurchaseOrder.delete(poNumber);

        // Create activity log data
        const createLogs = await createLog(
            AuthUser.id,
            `Menghapus data dari tabel Project_Purchase_Orders: ${poNumber}`
        );
    }

    static async provideUpdate(bodyRequest, poNumber, AuthUser) {
        const existedPO = await PurchaseOrder.findByNumb(poNumber);
        if (!existedPO) {
            throw new CustomError('Failed update, data not found', 400);
        }

        const existedProject = await Project.findById(existedPO.project_id);

        const inputRequest = {
            po_number: poNumber,
            project_name: bodyRequest.project_name ?? existedPO.project_name,
            customer: bodyRequest.customer_id ?? existedPO.customer,
            duration: bodyRequest.duration ? Number(bodyRequest.duration) : existedPO.duration,
            project_type: bodyRequest.project_type ?? existedPO.project_type,
            po_date: bodyRequest.po_date ?? existedPO.po_date,
            updated_by: bodyRequest.updated_by ?? existedPO.updated_by,
            live_date: bodyRequest.live_date ?? existedPO.live_date,
            po_description: bodyRequest.po_description ?? existedPO.po_description,
            attachment: bodyRequest.attachment ?? existedPO.attachment,
            notification_receivers: bodyRequest.notification_receivers ?? existedPO.notification_receivers
        };

        await PurchaseOrder.update(inputRequest);

        if (existedProject) {
            const inputUpdateProject = {
                id: existedPO.project_id,
                name: bodyRequest.project_name ?? existedProject.name,
                description: existedProject.description,
                status: existedProject.status,
                substatus: existedProject.substatus,
                status_info: existedProject.status_info,
                start_date: existedProject.start_date,
                end_date: existedProject.end_date,
                updated_by: bodyRequest.updated_by ?? existedProject.updated_by,
                po_description: bodyRequest.po_description ?? existedProject.po_description,
                attachment: bodyRequest.attachment ?? existedProject.attachment,
                notification_receivers: bodyRequest.notification_receivers ?? existedProject.notification_receivers
            };

            await Project.update(inputUpdateProject);
        }

        // Create activity log data
        await createLog(AuthUser.id, `Memperbarui data di tabel Project_Purchase_Orders: ${inputRequest.po_number}`);

        let receivers = bodyRequest.notification_receivers ? bodyRequest.notification_receivers : existedPO.notification_receivers;
        receivers = receivers.split(',');

        for (const receiver of receivers) {
            const assignedUser = await User.findById(receiver);
            if (!assignedUser) {
                continue;
            }
            const updater = await User.findById(bodyRequest.updated_by ?? existedPO.updated_by);
            if (!updater) {
                throw new CustomError('failed update, updater not found', 400);
            }
            if (assignedUser.email) {
                await sendEmail({ email: assignedUser.email, message: `<b>PO UPDATED</b><br><br>A PO has been updated by <b>${updater.id}-${updater.name}</b> with PO Number <b>${poNumber}</b>.`, subject: "Updation Purchase Order" })
            }
            if (assignedUser.phone_number) {
                await sendWhatsAppMessage({ phone: assignedUser.phone_number, message: `❗ *PO UPDATED* ❗\n\nA New PO has been updated by *${updater.id}-${updater.name}* with PO Number *${poNumber}*.` })
            }
        }

    }
}

module.exports = PurchaseOrderService;