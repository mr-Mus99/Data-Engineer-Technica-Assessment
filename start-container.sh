#!/bin/bash

# 1. Start MySQL background service
mysqld_safe --skip-log-error &

# 2. Wait until MySQL responds
echo "Waiting for MySQL database server to spin up..."

until mysqladmin ping -h"localhost" --silent; do
    sleep 1
done

#  change root account setting
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123'; FLUSH PRIVILEGES;"
# 4. Read your local .sql files directly into the active container database engine
if [ -d "./dataBase" ]; then
    echo "Importing source schema files into MySQL..."
    cat ./dataBase/*.sql | mysql -u root -p123
fi

#  open container with  terminal bash shell
echo "Database imported successfully! Dropping into terminal..."
exec bash