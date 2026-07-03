import Parser from "./Parser.js";
import mysql from "mysql2/promise";



const accounts = Parser("../accounts.csv");
const transactions = Parser("../transactions.csv");
const cards = Parser("../cards.csv");
const cashouts = Parser("../cashout.csv");
const customers = Parser("../customers.csv");
const purchases = Parser("../purchase.csv");
const transfares = Parser("../transfers.csv");

;

let connection;
connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin", // ⚠️ Put your actual local password here
  database: "oltp"  // ⚠️ Put your actual database name here
});


const query = `INSERT INTO CUSTOMERS (${customers.columnsNames}) VALUES ?`;
const query2 = `INSERT INTO accounts (${accounts.columnsNames}) VALUES ?`;
const query3 = `INSERT INTO cards (${cards.columnsNames}) VALUES ?`;
const query4 = `INSERT INTO cashout (${cashouts.columnsNames}) VALUES ?`;
const query5 = `INSERT INTO purchase (${purchases.columnsNames}) VALUES ?`;
const query6 = `INSERT INTO transactions (${transactions.columnsNames}) VALUES ?`;
const query7 = `INSERT INTO transfers (${transfares.columnsNames}) VALUES ?`;



const [result1] = await connection.query(query, [customers.rows]);
const [result2] = await connection.query(query2, [accounts.rows]);
const [result3] = await connection.query(query3, [cards.rows]);
const [result4] = await connection.query(query4, [cashouts.rows]);
const [result5] = await connection.query(query5, [purchases.rows]);
const [result6] = await connection.query(query6, [transactions.rows]);
const [result7] = await connection.query(query7, [transfares.rows]);





connection.end();

console.log("query: ", query);

