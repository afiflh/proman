const PostgresConnection = require("../../utils/databasePgConnection");

class ParameterModel {
  constructor() {
    this.db = new PostgresConnection();
  }

  async findAll() {
    const sql = `
      SELECT * FROM pm_parameter
      WHERE is_active = true
      ORDER BY id;
    `;
    try {
      const result = await this.db.query(sql);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findAllNoChild() {
    const sql = `
        SELECT * FROM pm_parameter 
        WHERE code = 'PROJECT_STATUS' AND "parameter" is null
        ORDER BY id;
    `;
    try {
      const result = await this.db.query(sql);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async create(inputRequest) {
    try {
      const sql = `
                    INSERT INTO pm_parameter (code, description, is_active, data, parameter)
                    VALUES ($1, $2, $3, $4, $5)
                  `
      const params = [
        inputRequest.code,
        inputRequest.description,
        inputRequest.is_active,
        inputRequest.data,
        inputRequest.parameter
      ]

      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async update(inputRequest) {
    try {
      const sql = `
                    UPDATE pm_parameter 
                    set description = $2, 
                        is_active = $3, 
                        data = $4, 
                        parameter = $5
                    WHERE id = $1
                  `
      const params = [
        inputRequest.param_id,
        inputRequest.description,
        inputRequest.is_active,
        inputRequest.data,
        inputRequest.parameter === 0 ? null : inputRequest.parameter
      ]

      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async delete(param_id) {
    try {
      const sql = `
                    DELETE FROM pm_parameter 
                    WHERE id = $1
                  `
      const params = [param_id];
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findChildParamater(parameter_id) {
    const sql = `
                SELECT pp.id, pp.data, pp.description
                FROM pm_parameter pp 
                WHERE pp."parameter" = $1 AND pp.is_active = true AND pp.code = 'PROJECT_STATUS'
                ORDER BY pp.id ASC
              `;
    const params = [parameter_id];

    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findAllProjectType() {
    const sql = `
                SELECT id, data, description FROM pm_parameter WHERE is_active = true and code = 'PROJECT_TYPE'
              `;
    const params = [];

    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findAllProjectStatus() {
    const sql = `
          SELECT * FROM pm_parameter WHERE code = 'PROJECT_STATUS'
        `;
    const params = [];

    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findAllProjectStatusNoChild() {
    const sql = `
          SELECT * FROM pm_parameter WHERE is_active = true and code = 'PROJECT_STATUS' AND parameter IS NULL ORDER BY id ASC
        `;
    const params = [];

    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findByData(dataParameter) {
    try {
      console.log('data parameter ', dataParameter);
      const sql = `
                    select * from pm_parameter p
                    where p.data = $1;
                  `
      const params = [dataParameter];

      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findById(param_id) {
    try {
      const sql = `
                    select * from pm_parameter p
                    where p.id = $1;
                  `
      const params = [param_id];

      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }
}

module.exports = ParameterModel;
