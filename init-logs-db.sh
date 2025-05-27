#!/bin/bash

set -e

# Load env variables from back/.env
set -a
if [ -f back/.env ]; then
  source back/.env
  set +a
else
  echo "ERROR: back/.env file not found!"
  exit 1
fi

# Container name should match docker-compose service name
DB_CONTAINER_NAME="${DB_HOST}"

echo "Waiting for PostgreSQL to become ready in container '$DB_CONTAINER_NAME'..."
for i in {1..30}; do
  if docker exec -u postgres "$DB_CONTAINER_NAME" pg_isready -U "$LOG_DB_USER" > /dev/null 2>&1; then
    echo "PostgreSQL is ready."
    break
  fi
  echo "PostgreSQL is not ready yet... ($i/30)"
  sleep 1
done

# Check if database exists
echo "Checking if database '$LOG_DB_DATABASE' exists in container '$DB_CONTAINER_NAME'..."

DB_EXISTS=$(docker exec -e PGPASSWORD="$LOG_DB_PASSWORD" -u postgres "$DB_CONTAINER_NAME" \
  psql -U "$LOG_DB_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$LOG_DB_DATABASE';")

if [ "$DB_EXISTS" = "1" ]; then
  echo "Database '$LOG_DB_DATABASE' already exists. Skipping creation."
else
  echo "Creating database '$LOG_DB_DATABASE'..."
  docker exec -e PGPASSWORD="$LOG_DB_PASSWORD" -u postgres "$DB_CONTAINER_NAME" \
    psql -U "$LOG_DB_USER" -d postgres -c "CREATE DATABASE \"$LOG_DB_DATABASE\";"

  echo "Granting all privileges on '$LOG_DB_DATABASE' to user '$LOG_DB_USER'..."
  docker exec -e PGPASSWORD="$LOG_DB_PASSWORD" -u postgres "$DB_CONTAINER_NAME" \
    psql -U "$LOG_DB_USER" -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE \"$LOG_DB_DATABASE\" TO \"$LOG_DB_USER\";"

  echo "Database created and permissions granted."
fi
