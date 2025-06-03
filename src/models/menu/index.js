const PostgresConnection = require("../../utils/databasePgConnection");

class MenuModel {
  constructor() {
    this.db = new PostgresConnection();
  }

  async findAll() {
    const sql = `
                    SELECT id, name, parent_id
                    FROM menu
                    WHERE is_active = '1'
                    ORDER BY parent_id`;

    try {
      const result = await this.db.query(sql);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }
}

module.exports = MenuModel;
