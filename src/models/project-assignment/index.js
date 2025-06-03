const PostgresConnection = require("../../utils/databasePgConnection");

class ProjectAssignmentModel {
  constructor() {
    this.db = new PostgresConnection();
  }

  async deleteAssigneeByProject(project_id) {
    const sql = `DELETE FROM pm_project_assignment WHERE project_id=$1`;
  
    const params = [project_id];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findFirstByProjectId(project_id) {
    const sql = `SELECT *
                 FROM pm_project_assignment ppa 
                 WHERE project_id=$1
                 ORDER BY project_id
                 LIMIT 1;
                 `
    const params = [project_id];
    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findByProjectId(id) {
    const sql = `SELECT u.id, u.name, u.email
                 FROM pm_project_assignment ppa 
                 JOIN users u ON ppa.user_assignment = u.id
                 WHERE project_id=$1
                 ORDER BY u.name ASC`;
    const params = [id];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }


  async findById(id) {
    const sql = `SELECT * FROM pm_project_assignment WHERE id=$1`;
    const params = [id];
    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async create(inputRequest) {
    const sql = `INSERT INTO pm_project_assignment (id, project_id, user_assignment) VALUES ($1, $2, $3)`;
    const params = [
      inputRequest.id,
      inputRequest.project_id,
      inputRequest.user_assignment,
    ];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findProjectId() {
    const sql = `SELECT id, project_id, user_assignment FROM pm_project_assignment`;
    const params = [];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }
}

module.exports = ProjectAssignmentModel;
