const PostgresConnection = require("../../utils/databasePgConnection");

class TimeframeModel {
    constructor() {
        this.db = new PostgresConnection();
    }

    async getReportProjecTimeframe(project_id) {
        try {
            const sql = `
                SELECT 
                    pptf.project_id, 
                    pp.name AS project_name, 
                    pptf.previous_status_id,
                    p.description AS previous_status_name, 
                    pptf.status_id,  
                    p2.description AS status_name, 
                    pptf.start_time, 
                    pptf.end_time, 
                    (pptf.end_time - pptf.start_time) AS duration, 
                    pptf.user_id AS followed_up_by, 
                    (SELECT name FROM users WHERE id = pptf.user_id) AS followed_up_by_name
                FROM 
                    pm_project_time_frame pptf 
                JOIN 
                    pm_project pp ON pptf.project_id = pp.id 
                LEFT JOIN 
                    pm_parameter p ON pptf.previous_status_id = p.id
                JOIN 
                    pm_parameter p2 ON pptf.status_id = p2.id 
                WHERE 
                    pptf.project_id = $1
                ORDER BY 
                    pptf.id ASC
            `;
            const params = [project_id];
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findAllAssignmentByProject(project_id) {
        try {
            const sql = `
                SELECT 
                    patf.project_id, 
                    pt.title AS task_name, 
                    pp.name AS project_name, 
                    patf.status_id, 
                    patf.task_id, 
                    patf.previous_status_id, 
                    patf.start_time, 
                    patf.end_time, 
                    (patf.end_time - patf.start_time) AS duration, 
                    patf.user_id AS followed_up_by,
                    (SELECT name FROM users WHERE id = patf.user_id) AS followed_up_by_name, 
                    pt.title AS task_name_from_tasklist
                FROM 
                    pm_assignment_time_frame patf
                JOIN 
                    pm_project pp ON patf.project_id = pp.id
                JOIN 
                    pm_tasklist pt ON patf.task_id = pt.kode 
                WHERE 
                    patf.project_id = $1
                ORDER BY 
                    patf.task_id ASC;
            `;
            const params = [project_id];
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }


    async findLastProject(project_id) {
        try {
            const sql = `
                SELECT * 
                FROM pm_project_time_frame pptf 
                WHERE pptf.project_id = $1
                ORDER BY pptf.id DESC 
                LIMIT 1;
            `;
            const params = [project_id];
            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async updateEndTime(timeframe_id, end_time) {
        try {
            const sql = `
                UPDATE pm_project_time_frame 
                SET end_time = $1
                WHERE id = $2;
            `;
            const params = [end_time, timeframe_id];
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async updateAssignment(timeframe_id, end_time) {
        try {
            const sql = `
                UPDATE pm_assignment_time_frame 
                SET end_time = $1
                WHERE id = $2;
            `;
            const params = [end_time, timeframe_id];
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async updateProjectEndTime(timeframe_id, end_time) {
        try {
            const sql = `
                UPDATE pm_project_time_frame 
                SET end_time = $1
                WHERE id = $2;
            `;
            const params = [end_time, timeframe_id];
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }


    async isExistedByStatus(inputTaskId) {
        const sql = `
            SELECT status_id FROM pm_project_time_frame pptf
            WHERE task_id = $1;
        `;
        const params = [inputTaskId];
        try {
            const result = await this.db.query(sql, params);
            if (result.length < 1) {
                return null;
            }
            const finalResult = result.map(item => item.status_id);
            return finalResult;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findLastProjectTimeframe(project_id) {
        try {
            const sql = `
                SELECT * FROM pm_project_time_frame pptf 
                WHERE project_id = $1
                ORDER BY pptf.id DESC 
                LIMIT 1;
            `;
            const params = [project_id];
            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findLast(task_id, user_id) {
        try {
            const sql = `
                SELECT * FROM pm_project_time_frame pptf 
                WHERE task_id = $1 AND user_id = $2
                ORDER BY pptf.id DESC 
                LIMIT 1;
            `;
            const params = [task_id, user_id];
            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findLastAssignment(task_id, user_id) {
        try {
            const sql = `
                SELECT * FROM pm_assignment_time_frame patf 
                WHERE task_id = $1 AND user_id = $2
                ORDER BY patf.id DESC 
                LIMIT 1;
            `;
            const params = [task_id, user_id];
            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async createProjectTimeframe(inputRequest) {
        const sql = `
                     insert into pm_project_time_frame (project_id, previous_status_id, status_id, start_time, end_time, user_id)
                     values ($1, $2, $3, $4, null, $5)
                    `
        const params = [
            inputRequest.project_id,
            inputRequest.previous_status_id,
            inputRequest.status_id,
            inputRequest.start_time,
            inputRequest.user_id
        ]
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async createNewTimeframe(inputRequest) {
        const sql = `
            INSERT INTO pm_project_time_frame (project_id, task_id, status_id, start_time, end_time, user_id) 
            VALUES ($1, $2, $3, $4, null, $5);
        `;
        const params = [
            inputRequest.project_id,
            inputRequest.task_id,
            inputRequest.status_id,
            inputRequest.start_time,
            inputRequest.user_id
        ];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async createNewTimeFrameAssignment(inputRequest) {
        const sql = `
            INSERT INTO pm_assignment_time_frame (project_id, task_id, previous_status_id, status_id, start_time, end_time, user_id) 
            VALUES ($1, $2, $3, $4, $5, null, $6);
        `;
        const params = [
            inputRequest.project_id,
            inputRequest.task_id,
            inputRequest.previous_status_id,
            inputRequest.status_id,
            inputRequest.start_time,
            inputRequest.user_id
        ];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }
}

module.exports = TimeframeModel;
