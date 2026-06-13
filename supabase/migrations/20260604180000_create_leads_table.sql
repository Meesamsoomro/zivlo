-- Create leads table
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    search_id INTEGER NOT NULL REFERENCES searches(search_id) ON DELETE CASCADE,
    company_number VARCHAR(255),
    name VARCHAR(255),
    business_name VARCHAR(255),
    type VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(255),
    website VARCHAR(255),
    email VARCHAR(255),
    director VARCHAR(255),
    incorporated VARCHAR(255),
    google_rating VARCHAR(255),
    website_status VARCHAR(255),
    company_status VARCHAR(255),
    message TEXT,
    personalised_pitch TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leads_search_id ON leads(search_id);
