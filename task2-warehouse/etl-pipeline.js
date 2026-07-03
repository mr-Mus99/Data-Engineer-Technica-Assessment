import mysql from "mysql2/promise";
import { DuckDBInstance, dateValue, timestampValue } from "@duckdb/node-api";
import config from "./config.js";
const { mysqlConfig, duckdbConfig, tableConfigs, appendValue } = config;

console.log("ETLPipeline", config.duckdbConfig);

async function ETLPipeline() {
  const pool = mysql.createPool(config.mysqlConfig); // create a MySQL pool
  const instance = await DuckDBInstance.create(config.duckdbConfig.path); // create a DuckDB instance
  const duckDBconnection = await instance.connect(); // Connect to DuckDB
  const mySqlconnection = await pool.getConnection(); // Connect to MySQL

  try {
    const custmersQuery = "SELECT * FROM customers"; // Query to fetch data
    for (let i = 0; i < tableConfigs.length; i++) {
      const currentTable = `SELECT * FROM ${tableConfigs[i].mysqlTable}`;
      await duckDBconnection.run(`DELETE FROM ${tableConfigs[i].targetTable}`); // Delete existing data
      const [rows] = await mySqlconnection.query(currentTable); // Fetch data
      const length = rows.length;
      const appender = await duckDBconnection.createAppender(tableConfigs[i].targetTable, "main"); // Create appender
      for (let j = 0; j < length; j++) { // Append data

        const columnLength = tableConfigs[i].columns.length; // Get column length
        console.log("columnLength", columnLength);
        for (let k = 0; k < columnLength; k++) {
          const column = tableConfigs[i].columns[k];
          const rawValue = rows[j][column.name];
          console.log("length", length, "table", tableConfigs[i].mysqlTable, "column Name", column.name,);

          appendValue(appender, column.type, rawValue);
        }
        appender.endRow();
      }
      appender.flushSync(); // Flush data
      await appender.closeSync(); // Close appender
    }


  } catch (error) {
    console.log(error);
  } finally {
    pool.end();
    duckDBconnection.disconnectSync();
  }
}

ETLPipeline();