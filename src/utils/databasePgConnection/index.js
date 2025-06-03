require("dotenv").config();
const { Pool, Client } = require("pg");
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = require("../../config/env");
const logger = require("../logger");

class PostgreConnection {
  constructor() {
    this.config = {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      max: 10,
      idleTimeoutMillis: 40000, // Waktu idle sebelum koneksi ditutup 
      connectionTimeoutMillis: 8000 // Timeout untuk menunggu koneksi
    };

    this.pool = new Pool(this.config);
  }

  async connect() { // if using Postgre Pool no need to use this function
    try {
      if (!this.config) {
        throw new Error("Database configuration is required!");
      }

      this.client = new Client(this.config);
      await this.client.connect();
      logger.info('Database connection opened')
    } catch (error) {
      throw error;
    }
  }

  async close() {
    if (this.client) {
      try {
        await this.pool.end();
        logger.info('Database connection closed')
      } catch (error) {
        console.error(
          "[INFO->DB<-]: error closing Postgres connection: ",
          error
        );
        throw error;
      }
    }
  }

  async query(sql, params) {

    // if (!this.client) {
    //   throw new Error("[INFO->DB<-]: Database doesn't connect properly");
    // }
    // try {
    //   const result = await this.client.query(sql, params);
    //   console.log(
    //     `[INFO-DB]: execute query ${sql} and params : ${undefined ? "no params" : params
    //     }`
    //   );
    //   return result.rows;
    // } catch (error) {
    //   console.error("[INFO->DB<-]: error executing query: ", error);
    //   throw error;
    // }

    // USING POSTGRE POOL <===============================================================================>
    try {
      const client = await this.pool.connect(); // mendapatkan koneksi dari pool
      logger.info('Getting database connection from pool');
      try {
        const result = await client.query(sql, params);
        logger.info(`execute query : ${sql} and params : ${params === undefined ? "no params" : params}`)
        return result.rows;
      } finally {
        client.release(); // melepas koneksi kembali ke pool setelah digunakan
        logger.info('Release database connection to pool')

      }
    } catch (error) {
      throw error;
    }
    // <================================================================================================>
  }
}

process.on('SIGINT', async () => {
  logger.warning(`\nReceived SIGINT, closing database pool..`)
  const postgre = new PostgreConnection();
  await postgre.close();
  process.exit(0);
})

module.exports = PostgreConnection;
