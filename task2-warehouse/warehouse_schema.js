import { DuckDBInstance } from "@duckdb/node-api";
import fs from "fs";

// if file allready exist delete it and build a new one
if (fs.existsSync("./dwh.duckdb")) {
  fs.unlinkSync("./dwh.duckdb");
}
const instance = await DuckDBInstance.create("dwh.duckdb");
const connection = await instance.connect();
const schema = fs.readFileSync("./warehouse-schema.sql", "utf-8");
const reader = await connection.run(schema);
console.log("reader: ", reader);