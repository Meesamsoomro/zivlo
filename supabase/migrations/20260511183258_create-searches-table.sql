-- Create searches table
CREATE TABLE searches (
    search_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    business_type VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    leads INTEGER DEFAULT 0,
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

-- Attach trigger to searches table
CREATE TRIGGER update_searches_updated_at 
    BEFORE UPDATE ON searches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_searches_user_id ON searches(user_id);
CREATE INDEX idx_searches_business_type ON searches(business_type);
CREATE INDEX idx_searches_location ON searches(location);
CREATE INDEX idx_searches_created_at ON searches(created_at);