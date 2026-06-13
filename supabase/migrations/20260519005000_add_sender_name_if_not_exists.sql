-- Add sender_name column to users table if it does not already exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS sender_name VARCHAR(100);
