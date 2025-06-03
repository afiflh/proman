require("dotenv").config();
const mysql = require("mysql2/promise");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require("../../config/env");

class MysqlConnection {
  constructor() {
    this.config = {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    };
    this.connection = null;
  }

  async connect() {
    if (!this.config) {
      throw new Error("Database configuration is required");
    }

    try {
      this.connection = await mysql.createConnection(this.config);
    } catch (error) { 
      console.error("Error connecting to MySQL:", error);
      throw error;
    }
  }

  async query(sql, params) {
    if (!this.connection) {
      throw new Error("Database connection is not established");
    }

    try {
      const [results] = await this.connection.execute(sql, params);
      console.log(
        `execute query : ${sql} and params : ${
          undefined ? "no params" : params
        }`
      );
      return results;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }

  async close() {
    if (this.connection) {
      try {
        await this.connection.end();
        console.log("MySQL connection closed");
      } catch (error) {
        console.error("Error closing MySQL connection:", error);
        throw error;
      }
    }
  }
}

module.exports = MysqlConnection;
