import { DuckDBInstance, dateValue, timestampValue } from "@duckdb/node-api";
export const mysqlConfig = {
  host: "localhost",
  user: "root",         //  MySQL username
  password: "123", //  MySQL password
  database: "oltp" //   database name
};
export const duckdbConfig = {
  path: "./dwh.duckdb"
};
const tableConfigs = [
  {
    mysqlTable: "customers", //customers
    targetTable: "dw_customers",
    columns: [
      { name: "customer_id", type: "VARCHAR" },
      { name: "first_name", type: "VARCHAR" },
      { name: "last_name", type: "VARCHAR" },
      { name: "email", type: "VARCHAR" },
      { name: "phone_number", type: "VARCHAR" },
      { name: "date_of_birth", type: "DATE" },
      { name: "created_at", type: "TIMESTAMP" },
      { name: "updated_at", type: "TIMESTAMP" },
    ],
  },
  {
    mysqlTable: "accounts", // accounts
    targetTable: "dw_accounts",
    columns: [
      { name: "account_id", type: "VARCHAR" },
      { name: "customer_id", type: "VARCHAR" },
      { name: "account_number", type: "VARCHAR" },
      { name: "account_type", type: "VARCHAR" },
      { name: "currency_code", type: "CHAR(3)" },
      { name: "balance", type: "DECIMAL(18, 2)" },
      { name: "status", type: "VARCHAR" },
      { name: "opened_at", type: "TIMESTAMP" },
      { name: "updated_at", type: "TIMESTAMP" },

    ],
  },
  {
    mysqlTable: "cards", //cards
    targetTable: "dw_cards",
    columns: [
      { name: "card_id", type: "VARCHAR" },
      { name: "account_id", type: "VARCHAR" },
      { name: "card_number", type: "VARCHAR" },
      { name: "card_type", type: "VARCHAR" },
      { name: "expiry_month", type: "SMALLINT" },
      { name: "expiry_year", type: "SMALLINT" },
      { name: "cvv_hash", type: "VARCHAR" },
      { name: "status", type: "VARCHAR" },
      { name: "issued_at", type: "TIMESTAMP" },
      { name: "updated_at", type: "TIMESTAMP" },
    ]
  },
  {
    mysqlTable: "transactions", //transactions
    targetTable: "dw_transactions",
    columns: [
      { name: "transaction_id", type: "VARCHAR" },
      { name: "account_id", type: "VARCHAR" },
      { name: "card_id", type: "VARCHAR" },
      { name: "reference_number", type: "VARCHAR" },
      { name: "transaction_type", type: "VARCHAR" },
      { name: "amount", type: "DECIMAL(18, 2)" },
      { name: "currency_code", type: "CHAR(3)" },
      { name: "transaction_date", type: "TIMESTAMP" },
      { name: "updated_at", type: "TIMESTAMP" },
      { name: "status", type: "VARCHAR" },
      { name: "description", type: "VARCHAR" },
    ]
  },
  {
    mysqlTable: "purchase", // purchase
    targetTable: "dw_purchases",
    columns: [
      { name: "purchase_id", type: "VARCHAR" },
      { name: "card_id", type: "VARCHAR" },
      { name: "merchant_name", type: "VARCHAR" },
      { name: "merchant_category", type: "VARCHAR" },
      { name: "merchant_country", type: "VARCHAR" },
      { name: "auth_code", type: "VARCHAR" },
      { name: "terminal_id", type: "VARCHAR" },
    ]
  },
  {
    mysqlTable: "cashout", //cashouts
    targetTable: "dw_cashouts",
    columns: [
      { name: "cashout_id", type: "VARCHAR" },
      { name: "account_id", type: "VARCHAR" },
      { name: "cashout_channel", type: "VARCHAR" },
      { name: "fee_amount", type: "DECIMAL(18, 2)" },
      { name: "fee_currency", type: "CHAR(3)" },
      { name: "cashout_amount", type: "DECIMAL(18, 2)" },
      { name: "cashout_currency", type: "CHAR(3)" },
      { name: "cashout_date", type: "TIMESTAMP" },
      { name: "location", type: "VARCHAR" },
    ]
  },
  {
    mysqlTable: "transfers", //transfers
    targetTable: "dw_transfers",
    columns: [
      { name: "transfer_id", type: "VARCHAR" },
      { name: "source_account_id", type: "VARCHAR" },
      { name: "destination_account_id", type: "VARCHAR" },
      { name: "transfer_method", type: "DECIMAL(18, 2)" },
      { name: "settled_at", type: "TIMESTAMP" },
      { name: "note", type: "VARCHAR" },
    ]
  },




  // add more { mysqlTable, targetTable, columns } entries here...
];

function appendValue(appender, type, value) {
  const baseType = type.toUpperCase().split('(')[0].trim(); // using trim() to remove any leading or trailing spaces
  switch (baseType) {
    case "VARCHAR":
    case "CHAR":
    case "DECIMAL":
      if (value === null || value === undefined) {
        appender.appendVarchar("NULL");
      } else {
        appender.appendVarchar(String(value));
      }
      break;
    case "INTEGER":
      appender.appendInteger(value);
      break;
    case "BIGINT":
      appender.appendBigInt(value === null || value === undefined ? null : BigInt(value));
      break;
    case "SMALLINT":
      appender.appendSmallInt(value);
      break;
    case "DATE":
      appender.appendDate(value ? dateValue(Math.floor(value.getTime() / 86400000)) : null);
      break;
    case "TIMESTAMP":
      appender.appendTimestamp(value ? timestampValue(BigInt(value.getTime()) * 1000n) : null);
      break;
    default:
      throw new Error(`Unsupported column type "${type}"`);
  }
}


export default { mysqlConfig, duckdbConfig, tableConfigs, appendValue };