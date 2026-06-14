-- Create free_trials table
-- Tracks anonymous free-search usage per browser fingerprint so a visitor
-- cannot reset their single free search just by clearing cookies.
CREATE TABLE free_trials (
    id SERIAL PRIMARY KEY,
    fingerprint VARCHAR(255) UNIQUE NOT NULL,
    trial_used BOOLEAN DEFAULT TRUE,
    ip_address VARCHAR(64),
    business_type VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to free_trials table
CREATE TRIGGER update_free_trials_updated_at
    BEFORE UPDATE ON free_trials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add index for fast fingerprint lookups
CREATE INDEX idx_free_trials_fingerprint ON free_trials (fingerprint);
