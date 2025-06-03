const PostgresConnection = require('../../utils/databasePgConnection');

class CustomerModel {
    constructor() {
        this.db = new PostgresConnection();
    }

    async findAll() {
        const sql = `SELECT c.*, u1.name AS "updated_by_name", u2.name AS "created_by_name" FROM customers c LEFT JOIN users u1 ON c.updated_by = u1.id LEFT JOIN users u2 ON c.created_by = u2.id ORDER BY c.name ASC`;

        try {
            const result = await this.db.query(sql);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findById(id) {
        const sql = `SELECT * FROM customers WHERE id = $1`;
        const values = [id];

        try {
            const result = await this.db.query(sql, values);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async store(inputRequest) {
        const sql = `
            INSERT INTO customers (id, name, is_active, created_by, created_time)
            VALUES ($1, $2, $3, $4, NOW())
        `;

        const values = [
            inputRequest.id,
            inputRequest.name,
            inputRequest.is_active,
            inputRequest.created_by,
        ];

        try {
            const result = await this.db.query(sql, values);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async update(inputRequest) {
        const sql = `
            UPDATE customers
            SET name = $2, is_active = $3, updated_by = $4, updated_time = NOW()
            WHERE id = $1
        `;

        const values = [
            inputRequest.cust_id,
            inputRequest.name,
            inputRequest.is_active,
            inputRequest.updated_by,
        ];

        try {
            const result = await this.db.query(sql, values);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async delete(id) {
        const sql = `DELETE FROM customers WHERE id = $1`;
        const values = [id];

        try {
            const result = await this.db.query(sql, values);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }
}




module.exports = CustomerModel;