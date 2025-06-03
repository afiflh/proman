const PostgresConnection = require('../../utils/databasePgConnection');


class CommentsModel {
    constructor() {
        this.db = new PostgresConnection();
    }

    async create(inputRequest) {
        const sql = `INSERT INTO comments (id, tasklist_id, subtasklist_id, comment, comment_mode, created_by, created_time) 
                     VALUES ( $1, $2, $3, $4, $5, $6, NOW())`;
        const params = [
            inputRequest.id,
            inputRequest.tasklist_id,
            inputRequest.subtasklist_id,
            inputRequest.comment,
            inputRequest.comment_mode,
            inputRequest.created_by,
        ];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findByTasklist(tasklistId) {
        const sql = `select c.id, c.tasklist_id, c.subtasklist_id, c."comment", c."comment_mode", c."created_time", c.created_by as sender_id, u.name as sender_name
                     from "comments" c 
                     join users u on u.id = c.created_by 
                     where c.tasklist_id = $1 and c.comment_mode = 'tasklist'`
        const params = [tasklistId];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findBySubtasklist(subtasklistId) {
        const sql = `select c.id, c.tasklist_id, c.subtasklist_id, c."comment", c."comment_mode", c."created_time", u.id as sender_id, u.name as sender_name
                     from "comments" c 
                     join users u on u.id = c.created_by 
                     where c.subtasklist_id = $1 and c.comment_mode = 'subtasklist'`
        const params = [subtasklistId];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findByParams(identifier, mode) {
        const foreignColumn = mode === 'tasklist'
            ? 'tasklist_id'
            : 'subtasklist_id';
        const sql = `select c.id, c.tasklist_id, c.subtasklist_id, c."comment", c."comment_mode", c."created_time", u.id as sender_id, u.name as sender_name
                     from "comments" c 
                     join users u on u.id = c.created_by 
                     where c.${foreignColumn} = $1 and c.comment_mode = $2`;
        const params = [identifier, mode];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }
}

module.exports = CommentsModel;