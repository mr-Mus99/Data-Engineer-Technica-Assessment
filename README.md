### Data-Engineer-Technica-Assessment


### for seamless execution please use docker 

## docker installation like soo, please fallow your distribution guide to install docker


``` winget install -e --id Docker.DockerDesktop ```
if on windows you will need to install wsl first

install wsl
``` wsl --install ```

### prequisites

- NodeJS
- MySQL
- DuckDB
- wsl
- docker

## Docker setup

```docker build -t etl-pipeline .```  
```docker run -it --name pipeline-run --rm etl-pipeline```  

# affter this you will be inside the docker container

## run the following load data to the database structure

```cd task1-DB/ && node loader.js```

## run the following to create the warehouse schema

 ```cd /app/task2-warehouse && node warehouse_schema.js```

run the following to load the data to the warehouse

```cd /app/task2-warehouse && node ./etl-pipeline.js```

to remove the data from the warehouse and start again just run ```cd /app/task2-warehouse && node warehouse_schema.js```  and  
```cd /app/task2-warehouse && node ./etl-pipeline.js``` again

run the following to access the warehouse database ```duckdb dwh.duckdb```





### if u want to lunch without docker use the following commands

``` winget install Oracle.MySQL ```  

``` winget install OpenJS.NodeJS.LTS ```  

``` winget install DuckDB.cli ```


 



*import the data to the database structure  from folder "./database"*  
``` Get-Content .\dataBase\*.sql | & mysql.exe -u root -p ```  

### Using Explicit Binary Absolute Paths (Fallback)

```Get-Content .\dataBase\*.sql | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p ```

### Alternative (Directly inside the MySQL Shell Client)

``` source C:/path/to/your/project/dataBase/oltp_customers.sql; ```  
``` source C:/path/to/your/project/dataBase/oltp_accounts.sql; ```  
``` source C:/path/to/your/project/dataBase/oltp_cards.sql; ```  
``` source C:/path/to/your/project/dataBase/oltp_transactions.sql; ```  
``` source C:/path/to/your/project/dataBase/oltp_purchase.sql; ```  
``` source C:/path/to/your/project/dataBase/oltp_cashout.sql; ```  
``` source C:/path/to/your/project/dataBase/oltp_transfers.sql; ```  




