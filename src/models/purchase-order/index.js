const PostgresConnection = require("../../utils/databasePgConnection");

class PurchaseOrderModel {

    constructor() {
        this.db = new PostgresConnection();
    }

    async findCustomerProjects(cust_id) {
        try {
            const sql = `select ppo.project_id, ppo.project_name, ppo.customer as customer_id, pp.start_date, pp.end_date, pps.project_status as project_status
                         from project_purchase_orders ppo 
                         join pm_project pp on ppo.project_id  = pp.id
                         join pm_project_status pps on pp.id = pps.project_id
                         where ppo.customer = $1
                        `;
            const params = [cust_id];

            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }

    }

    async findByCustomer(cust_id) {
        try {
            const sql = `SELECT * 
                         FROM project_purchase_orders
                         WHERE customer = $1
                         LIMIT 1
                        `;
            const params = [cust_id];

            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findLastByProjectId(prefix, currentYearMonth) {
        try {
            const sql = `SELECT project_id 
                         FROM project_purchase_orders
                         WHERE project_id LIKE $1
                         ORDER BY project_id DESC
                         LIMIT 1
                        `;
            const params = [`${prefix}${currentYearMonth}%`];

            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async getProjectIdandName() {
        try {
            const sql = 'SELECT project_id, project_name, duration FROM project_purchase_orders ORDER BY updated_time DESC';
            const params = [];

            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findByProjectId(project_id) {
        try {
            const sql = 'SELECT * FROM project_purchase_orders WHERE project_id = $1'
            const params = [project_id];

            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findByNumb(po_number) {
        try {
            const sql = 'SELECT * FROM project_purchase_orders WHERE po_number = $1'
            const params = [po_number];

            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findAll() {
        try {
            const sql = `SELECT 
                            ppo.po_number,
                            ppo.project_id,
                            ppo.project_name,
                            ppo.customer AS "customer_id",
                            ppo.po_description, 
                            ppo.attachment,
                            c.name AS "customer_name",
                            p.description AS "project_type",
                            p.id AS "parameter_id",
                            ppo.po_date,
                            ppo.duration,
                            ppo.updated_by,
                            u1.name AS "updated_by_name",
                            ppo.updated_time,
                            ppo.created_by,
                            ppo.live_date,
                            u2.name AS "created_by_name",
                            ppo.created_time,
                            ppo.notification_receivers,
                            (
                                SELECT STRING_AGG(u.name, ', ')
                                FROM users u
                                WHERE u.id = ANY (string_to_array(ppo.notification_receivers, ','))
                            ) AS "notification_receiver_names"
                        FROM project_purchase_orders ppo
                        JOIN pm_parameter p ON p.data = ppo.project_type
                        JOIN customers c ON ppo.customer = c.id
                        LEFT JOIN users u1 ON ppo.updated_by = u1.id
                        LEFT JOIN users u2 ON ppo.created_by = u2.id;
                         `
            const params = [];

            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async create(inputRequest) {
        try {
            const sql = `INSERT INTO project_purchase_orders (
                            po_number, project_id, project_name, customer, 
                            project_type, po_date, created_by, created_time, 
                            duration, live_date, attachment, po_description, notification_receivers)
                         VALUES (
                            $1, $2, $3, $4, $5, $6, $7, NOW(), 
                            $8, $9, $10, $11, $12)`;
            const params = [
                inputRequest.po_number,
                inputRequest.project_id,
                inputRequest.project_name,
                inputRequest.customer,
                inputRequest.project_type,
                inputRequest.po_date,
                inputRequest.created_by,
                inputRequest.duration,
                inputRequest.live_date,
                inputRequest.attachment,
                inputRequest.po_description,
                inputRequest.notification_receivers
            ];
    
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }
    

    async update(inputRequest) {
        try {
            const sql = `UPDATE project_purchase_orders 
                         SET project_name = $1, customer = $2, project_type = $3, duration = $4, po_date = $5, updated_by = $6, updated_time = NOW() , live_date = $7, attachment = $8, po_description = $9, notification_receivers = $11
                         WHERE po_number = $10`;
            const params = [
                inputRequest.project_name,
                inputRequest.customer,
                inputRequest.project_type,
                inputRequest.duration,
                inputRequest.po_date,
                inputRequest.updated_by,
                inputRequest.live_date,
                inputRequest.attachment,
                inputRequest.po_description,
                inputRequest.po_number,
                inputRequest.notification_receivers
            ];

            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async delete(po_numb) {
        const sql = `DELETE FROM project_purchase_orders WHERE po_number=$1`;
        const params = [po_numb];

        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }
}

module.exports = PurchaseOrderModel;