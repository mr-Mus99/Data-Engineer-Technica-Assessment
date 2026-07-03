-- CUSTOMERS table structure
CREATE TABLE IF NOT EXISTS dw_customers (
    customer_id VARCHAR PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE,
    phone_number VARCHAR NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--  ACCOUNTS table
CREATE TABLE IF NOT EXISTS dw_accounts (
    account_id VARCHAR PRIMARY KEY,
    customer_id VARCHAR, --Foreign key 
    account_number VARCHAR UNIQUE,
    account_type VARCHAR NOT NULL,
    currency_code CHAR(3) NOT NULL,
    balance DECIMAL(18, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    opened_at TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    Foreign Key (customer_id) REFERENCES dw_customers (customer_id)
);

CREATE TABLE IF NOT EXISTS dw_cards (
    card_id VARCHAR PRIMARY KEY,
    account_id VARCHAR, -- Foreign key 
    card_number VARCHAR UNIQUE,
    card_type VARCHAR NOT NULL,
    expiry_month SMALLINT NOT NULL,
    expiry_year SMALLINT NOT NULL,
    cvv_hash VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    issued_at TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (account_id) REFERENCES dw_accounts (account_id)
);

CREATE TABLE IF NOT EXISTS dw_transactions (
    transaction_id VARCHAR PRIMARY KEY,
    account_id VARCHAR, -- Foreign key 
    card_id VARCHAR NULL,
    reference_number VARCHAR NOT NULL,
    transaction_type VARCHAR NOT NULL,
    amount decimal(18, 2) NOT NULL,
    currency_code CHAR(3) NOT NULL,
    transaction_date TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status VARCHAR NOT NULL,
    description VARCHAR,
    Foreign Key (account_id) REFERENCES dw_accounts (account_id),
);

CREATE TABLE IF NOT EXISTS dw_purchases (
    purchase_id VARCHAR PRIMARY KEY,
    card_id VARCHAR,
    merchant_name VARCHAR NOT NULL,
    merchant_category VARCHAR NOT NULL,
    merchant_country VARCHAR,
    auth_code VARCHAR,
    terminal_id VARCHAR,
    Foreign Key (card_id) REFERENCES dw_cards (card_id)
);
--  CASHOUTS table structure
CREATE TABLE IF NOT EXISTS dw_cashouts (
    cashout_id VARCHAR PRIMARY KEY,
    account_id VARCHAR,
    cashout_channel VARCHAR,
    fee_amount DECIMAL(18, 2),
    fee_currency CHAR(3),
    cashout_amount DECIMAL(18, 2),
    cashout_currency CHAR(3),
    cashout_date TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    location VARCHAR,
    Foreign Key (account_id) REFERENCES dw_accounts (account_id)
);

-- 7.  TRANSFERS table
CREATE TABLE IF NOT EXISTS dw_transfers (
    transfer_id VARCHAR PRIMARY KEY,
    source_account_id VARCHAR, -- Foreign key 
    destination_account_id VARCHAR, -- Foreign key
    transfer_method VARCHAR NOT NULL,
    settled_at TIMESTAMP NOT NULL,
    note VARCHAR,
    Foreign Key (source_account_id) REFERENCES dw_accounts (account_id),
    Foreign Key (destination_account_id) REFERENCES dw_accounts (account_id)
);