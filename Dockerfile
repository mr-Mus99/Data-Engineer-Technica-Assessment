FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js, and MySQL Server
RUN apt-get update && apt-get install -y curl gnupg ca-certificates mysql-server unzip && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /etc/apt/keyrings \
  && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
  && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
  && apt-get update && apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*

# download duckdb latest version cli
RUN DUCKDB_URL=$(curl -s https://api.github.com/repos/duckdb/duckdb/releases/latest | grep "browser_download_url.*duckdb_cli-linux-amd64.zip" | cut -d '"' -f 4) \
  && curl -L -o duckdb.zip "$DUCKDB_URL" \
  && unzip duckdb.zip -d /usr/local/bin \
  && rm duckdb.zip


# Configure MySQL runtime directories
RUN mkdir -p /var/run/mysqld && chown mysql:mysql /var/run/mysqld

WORKDIR /app

# Install dependencies and copy workspace
COPY package*.json ./
RUN npm install
COPY . .

RUN chmod +x start-container.sh

EXPOSE 3306

ENTRYPOINT ["./start-container.sh"]