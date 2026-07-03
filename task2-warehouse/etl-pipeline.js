import mysql from "mysql2/promise";
import { DuckDBInstance, dateValue, timestampValue } from "@duckdb/node-api";
import config from "./config.js";
const { mysqlConfig, duckdbConfig, tableConfigs, appendValue } = config;

console.log("ETLPipeline", config.duckdbConfig);

function toDuckTimestamp(jsDate) {
  if (!jsDate) return null;
  return timestampValue(BigInt(jsDate.getTime()) * 1000n);
}
function toDuckDate(jsDate) {
  if (!jsDate) return null;
  return dateValue(Math.floor(jsDate.getTime() / 86400000));
}



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
      // console.log("length", length, "table", tableConfigs[i].mysqlTable);
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






    // const [customers] = await mySqlconnection.query(custmersQuery); // Fetch data
    // const appender = await duckDBconnection.createAppender("dw_customers", "main"); // Create appender
    // const length = customers.length;
    // for (let i = 0; i < length; i++) { // Append data
    //   appender.appendVarchar(customers[i].customer_id);
    //   appender.appendVarchar(customers[i].first_name);
    //   appender.appendVarchar(customers[i].last_name);
    //   appender.appendVarchar(customers[i].email);
    //   appender.appendVarchar(customers[i].phone_number);
    //   appender.appendDate(toDuckDate(customers[i].date_of_birth));
    //   appender.appendTimestamp(toDuckTimestamp(customers[i].created_at));
    //   appender.appendTimestamp(toDuckTimestamp(customers[i].updated_at));
    //   appender.endRow();
    // }

    // appender.flushSync(); // Flush data
    // await appender.closeSync(); // Close appender

  } catch (error) {
    console.log(error);
  } finally {
    pool.end();
    duckDBconnection.disconnectSync();
  }
}

ETLPipeline();







// import mysql from "mysql2/promise";
// import { DuckDBInstance, dateValue, timestampValue } from "@duckdb/node-api";
// import config from "./config.js";
// const { mysqlConfig, duckdbConfig, tableConfigs, appendValue } = config;

// console.log("ETLPipeline", config.duckdbConfig);

// function toDuckTimestamp(jsDate) {
//   if (!jsDate) return null;
//   return timestampValue(BigInt(jsDate.getTime()) * 1000n);
// }
// function toDuckDate(jsDate) {
//   if (!jsDate) return null;
//   return dateValue(Math.floor(jsDate.getTime() / 86400000));
// }



// async function ETLPipeline() {
//   const pool = mysql.createPool(config.mysqlConfig); // create a MySQL pool
//   const instance = await DuckDBInstance.create(config.duckdbConfig.path); // create a DuckDB instance
//   const duckDBconnection = await instance.connect(); // Connect to DuckDB
//   const mySqlconnection = await pool.getConnection(); // Connect to MySQL
//   const custmersQuery = "SELECT * FROM customers"; // Query to fetch data
//   await duckDBconnection.run("DELETE FROM dw_customers"); // Delete existing data
//   try {
//     const [customers] = await mySqlconnection.query(custmersQuery); // Fetch data
//     const length = customers.length;
//     for (let i = 0; i < length; i++) { // Append data


//       const appender = await duckDBconnection.createAppender(tableConfigs[i].duckTable, "main"); // Create appender
//       // const tableMap = tableConfigs[i].tableMap; // Get table map
//       await duckDBconnection.run(`DELETE FROM ${tableConfigs[i].duckTable}`);
//       const sqlQuery = `select * from ${tableConfigs[i].mysqlTable}`;
//       const columnslen = tableConfigs[i].columns.length;
//       for (let c = 0; c < columnslen; c++) {
//         const colConfig = tableConfigs[i].columns[c];
//         const rawValue = currentRow[colConfig.name];
//         const type = colConfig.type.toUpperCase();
//         const [rows] = await mySqlconnection.query(sqlQuery);
//         const length = rows.length;


//         if (type.includes("VARCHAR") || type.includes("CHAR")) {
//           appender.appendVarchar(rawValue !== null && rawValue !== undefined ? String(rawValue) : null);
//         }
//         else if (type.includes("DATE")) {
//           appender.appendDate(toDuckDate(rawValue));
//         }
//         else if (type.includes("TIMESTAMP")) {
//           appender.appendTimestamp(toDuckTimestamp(rawValue));
//         }
//         else if (type.includes("DECIMAL")) {
//           appender.appendVarchar(rawValue !== null && rawValue !== undefined ? String(rawValue) : null);
//         } else if (type.includes("INTEGER")) {
//           appender.appendInteger(rawValue !== null && rawValue !== undefined ? Number(rawValue) : null);
//         } else if (type.includes("BIGINT")) {
//           appender.appendBigInt(rawValue !== null && rawValue !== undefined ? BigInt(rawValue) : null);
//         } else {
//           throw new Error(`Unsupported column type ""`);
//         }
//       }

//       appender.endRow();
//     }

//     appender.flushSync(); // Flush data
//     await appender.closeSync(); // Close appender

//   } catch (error) {
//     console.log(error);
//   } finally {
//     if (mySqlconnection) mySqlconnection.release();
//     if (pool) pool.end();
//     if (duckDBconnection) duckDBconnection.disconnectSync();
//   }
// }

// ETLPipeline();