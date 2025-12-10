-- Add date column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_date DATE DEFAULT CURRENT_DATE;
