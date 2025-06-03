const PostgresConnection = require("../../utils/databasePgConnection");

class SubtasklistModel {
  constructor() {
    this.db = new PostgresConnection();
  }

  async findById(codeId) {
    const sql = `
                  SELECT 
                    ps.kode as kode,
                    ps.tasklist_id as tasklist_id,
                    ps.title as title,
                    ps.description as description,
                    ps.attachment as attachment,
                    ps.created_by as created_by,
                    ps.assignee as assignee,
                    ps.status_id as status_id,
                    pp.id as project_id,
                    pp."name" as project_name
                  FROM pm_subtasklist ps
                  join pm_tasklist pt on pt.kode = ps.tasklist_id
                  join pm_project pp on pt.project_id = pp.id 
                  where ps.kode = $1`;
    const params = [codeId];

    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findAll(tasklistCode) {
    const sql = `  SELECT 
                    ps.kode, 
                    ps.title, 
                    ps.description, 
                    ps.attachment, 
                    ps.assignee, 
                    ps.created_by, 
                    u.name AS created_by_name, 
                    ps.status_id, 
                    pst.name AS status_name,
                    pp.id as project_id,
                    pp."name" as project_name
                  FROM pm_subtasklist ps
                  JOIN pm_status pst ON ps.status_id = pst.id
                  join pm_tasklist pt on ps.tasklist_id = pt.kode
                  join pm_project pp on pp.id = pt.project_id 
                  LEFT JOIN  users u ON ps.created_by = u.id
                  WHERE 
                    ps.tasklist_id = $1;`;
    const params = [tasklistCode];

    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async getCountSubtakslist(tasklistCode) {
    const sql = `SELECT COUNT(*) AS count_data FROM pm_subtasklist ps WHERE ps.tasklist_id = $1`;
    const params = [tasklistCode];

    try {
      const result = await this.db.query(sql, params);
      return result[0];
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async create(data) {
    const sql = `INSERT INTO pm_subtasklist (kode, tasklist_id, title, description, attachment, created_by, assignee, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      data.kode,
      data.tasklist_id,
      data.title,
      data.description,
      data.attachment,
      data.created_by,
      data.assignee,
      data.status_id,
    ];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async update(inputRequest) {
    const sql = `UPDATE pm_subtasklist
                 SET title = $1, description = $2, attachment = $3, assignee = $4
                 WHERE kode = $5
                `;
    const params = [
      inputRequest.title,
      inputRequest.description,
      inputRequest.attachment,
      inputRequest.assignee,
      inputRequest.codeId,
    ];

    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async updateStatus(inputStatus, subtasklistCode) {
    const sql = `update pm_subtasklist
                 set status_id = $1
                 where kode = $2
                `;
    const params = [inputStatus, subtasklistCode];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async udpateAssigne(inputAssignee, subtasklistCode) {
    const sql = `update pm_subtasklist
                 set assignee = $1
                 where kode = $2
                `;
    const params = [inputAssignee, subtasklistCode];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }
}

module.exports = SubtasklistModel;
