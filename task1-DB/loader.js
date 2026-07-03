import Parser from "./Parser.js";
import mysql from "mysql2/promise";



const accounts = Parser("../data-Tables/accounts.csv");
const transactions = Parser("../data-Tables/transactions.csv");
const cards = Parser("../data-Tables/cards.csv");
const cashouts = Parser("../data-Tables/cashout.csv");
const customers = Parser("../data-Tables/customers.csv");
const purchases = Parser("../data-Tables/purchase.csv");
const transfares = Parser("../data-Tables/transfers.csv");

console.log("connecting to database... ");

let connection;
connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123", // ⚠️ Put your actual local password here
  database: "oltp"  // ⚠️ Put your actual database name here
});
console.log("loading data...");


await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
// 2. Clear the data from the tables
await connection.query('DELETE FROM customers;');
await connection.query('DELETE FROM accounts;');
await connection.query('DELETE FROM cards;');
await connection.query('DELETE FROM cashout;');
await connection.query('DELETE FROM purchase;');
await connection.query('DELETE FROM transactions;');
await connection.query('DELETE FROM transfers;');
// 3. Turn safety constraints back on
await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

const query = `INSERT INTO customers (${customers.columnsNames}) VALUES ?`;
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

console.log("finished loading data");

