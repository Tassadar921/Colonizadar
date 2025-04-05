-- Drop the database if it exists
DROP DATABASE IF EXISTS colonizadar;

-- Create a new database
CREATE DATABASE colonizadar;

-- Create the user (if not exists)
CREATE USER superadmin WITH PASSWORD 'xxx';

-- Grant all privileges to the user on the database
GRANT ALL PRIVILEGES ON DATABASE colonizadar TO superadmin;

-- Optional: Connect to the new database to apply changes (if needed)
\c colonizadar;
