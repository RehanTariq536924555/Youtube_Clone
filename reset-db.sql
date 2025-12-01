-- Connect to PostgreSQL and run these commands to reset the database

-- First, disconnect all connections to the database
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'Youtube' AND pid <> pg_backend_pid();

-- Drop the existing database
DROP DATABASE IF EXISTS "Youtube";

-- Create a fresh database
CREATE DATABASE "Youtube";

-- Grant permissions (adjust username if needed)
GRANT ALL PRIVILEGES ON DATABASE "Youtube" TO postgres;