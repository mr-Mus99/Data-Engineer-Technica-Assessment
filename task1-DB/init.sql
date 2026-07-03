-- Active: 1782753841018@@127.0.0.1@3306

-- dont run this file this is only a preview of how the database was created , this file cotains errors that are fixed later
-- import DateBase structure diractly from "./dataBase" file
CREATE DATABASE IF NOT EXISTS oltp;

USE oltp;

show TABLES;

create TABLE if NOT EXISTS CUSTOMERS (
    customer_id varchar(200) NOT NULL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(30) NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

desc CUSTOMERS;

create TABLE if NOT EXISTS ACCOUNTS (
    account_id VARCHAR(200) PRIMARY KEY,
    custmer_id varchar(200),
    account_number VARCHAR(34) UNIQUE,
    account_type VARCHAR(50) NOT NULL,
    currency_code CHAR(3) NOT NULL,
    balance decimal(18, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    opend_at TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    updaated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Foreign Key (custmer_id) REFERENCES CUSTOMERS (customer_id)
);

create Table if not EXISTS CARDS (
    card_id VARCHAR(200) PRIMARY KEY,
    account_id VARCHAR(200),
    card_number VARCHAR(19) UNIQUE,
    card_type VARCHAR(20) NOT NULL,
    expirey_month SMALLINT NOT NULL,
    expirey_year SMALLINT NOT NULL,
    cvv_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) not NULL,
    issued_at TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Foreign Key (account_id) REFERENCES ACCOUNTS (account_id)
);

alter Table CUSTOMERS MODIFY customer_id varchar(200);

create Table IF NOT EXISTS TRANSACTIONS (
    transaction_id VARCHAR(200) PRIMARY KEY,
    account_id VARCHAR(200),
    card_id VARCHAR(200) NULL, --the ERD dose not include wether this table is a FOREIGN KEY or not 
    reference_number VARCHAR(200) not NULL,
    transaction_type VARCHAR(30) NOT NULL,
    amount decimal(18, 2) NOT NULL,
    currency_code CHAR(3) NOT NULL,
    transaction_date TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    description VARCHAR(255) NULL,
    Foreign Key (account_id) REFERENCES ACCOUNTS (account_id),
)

create table if not exists PURCHASE (
    puchase_id VARCHAR(200) PRIMARY KEY,
    card_id VARCHAR(200),
    merchant_name VARCHAR(255) NOT NULL,
    merchant_category VARCHAR(100) NOT NULL,
    merchant_cuntery VARCHAR(100) NULL,
    auth_code VARCHAR(50) NULL,
    terminal_id VARCHAR(50) NULL,
    Foreign Key (card_id) REFERENCES CARDS (card_id)
);

create table if not EXISTS CASHOUT (
    cashout_id VARCHAR(200) PRIMARY KEY,
    account_id VARCHAR(200),
    cashout_channel varchar(30) NOT NULL,
    fee_ammount decimal(18, 2) NOT NULL,
    fee_currency char(3) NOT NULL,
    cashout_ammount decimal(18, 2) NOT NULL,
    cashout_currency char(3) NOT NULL,
    cashout_date TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    location VARCHAR(255) NULL,
    Foreign Key (account_id) REFERENCES ACCOUNTS (account_id)
);

DESC CASHOUT;

create table if not EXISTS TRANSFERS (
    transfer_id VARCHAR(200) PRIMARY KEY,
    source_account_id VARCHAR(200),
    destination_account_id VARCHAR(200),
    transfer_method VARCHAR(30) NOT NULL,
    settled_at TIMESTAMP not NULL,
    note VARCHAR(255) NULL,
    Foreign Key (source_account_id) REFERENCES ACCOUNTS (account_id),
    Foreign Key (destination_account_id) REFERENCES ACCOUNTS (account_id)
);

show tables;

desc purchase;

use oltp;

alter Table purchase
RENAME COLUMN merchant_cuntery to merchant_country;