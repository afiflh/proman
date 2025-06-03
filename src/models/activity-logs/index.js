const PostgresConnection = require("../../utils/databasePgConnection");

class ActivityLogModel {
    constructor() {
        this.db = new PostgresConnection();
    }

    async create(inputRequest) {
        const sql = `
                    INSERT into activity_logs (user_id, activity, date_time) 
                    VALUES ($1, $2, NOW())
                `;

        const params = [
            inputRequest.user_id,
            inputRequest.activity,
        ]

        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async getAll(inputVariables) {
        try {
            const { limit, offset, search } = inputVariables;

            const searchQuery = search ? `WHERE user_id ILIKE $3 OR activity ILIKE $3 OR date_time::TEXT ILIKE $3`
                : '';
            console.log(searchQuery);


            const sql = `
                         SELECT * 
                         FROM activity_logs
                         ${searchQuery}
                         ORDER BY date_time DESC
                         LIMIT $1 
                         OFFSET $2
                        `;
            const params = search ? [limit, offset, `%${search}%`] : [limit, offset];

            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async getAllLimitless() {
        try {
            const sql = `
                          SELECT * 
                          FROM activity_logs
                          ORDER BY date_time DESC
                         `
            const result = await this.db.query(sql);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async getCountAll(searchParam = null) {
        try {
            const searchQuery = searchParam ? `WHERE user_id ILIKE $1 OR activity ILIKE $1 OR date_time::TEXT ILIKE $1`
                : '';
            const sql = `SELECT COUNT(*) FROM activity_logs ${searchQuery}`;
            const params = searchParam ? [`%${searchParam}%`] : [];

            const result = await this.db.query(sql, params);
            return result.length > 0 ? parseInt(result[0].count) : 0;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }
}

module.exports = ActivityLogModel;
