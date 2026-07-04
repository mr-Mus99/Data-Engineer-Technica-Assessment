#!/bin/bash

#  Start MySQL background service
mysqld_safe --skip-log-error &


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


echo "Database imported successfully"
exec bash