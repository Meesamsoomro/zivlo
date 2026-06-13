-- Create payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    sub_id INTEGER NOT NULL REFERENCES subscriptions (id) ON UPDATE CASCADE ON DELETE CASCADE,
    per_day INTEGER DEFAULT 5,
    per_month INTEGER DEFAULT 150,
    start_from TIMESTAMP WITH TIME ZONE,
    end_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to is_active column
COMMENT ON COLUMN payments.is_active IS '1=Active, 0=Inactive';

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to payments table
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_payments_user_id ON payments (user_id);

CREATE INDEX idx_payments_sub_id ON payments (sub_id);

CREATE INDEX idx_payments_is_active ON payments (is_active);

CREATE INDEX idx_payments_end_at ON payments (end_at);