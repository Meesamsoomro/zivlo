-- Add pitch_context column to users table if it does not already exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS pitch_context VARCHAR(150);
