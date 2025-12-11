-- Add user_id column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add user_id column to guests table  
ALTER TABLE guests ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Drop existing public policies on events
DROP POLICY IF EXISTS "Allow public read access on events" ON events;
DROP POLICY IF EXISTS "Allow public insert access on events" ON events;
DROP POLICY IF EXISTS "Allow public update access on events" ON events;
DROP POLICY IF EXISTS "Allow public delete access on events" ON events;

-- Drop existing public policies on guests
DROP POLICY IF EXISTS "Allow public read access on guests" ON guests;
DROP POLICY IF EXISTS "Allow public insert access on guests" ON guests;
DROP POLICY IF EXISTS "Allow public update access on guests" ON guests;
DROP POLICY IF EXISTS "Allow public delete access on guests" ON guests;

-- Drop existing public policies on event_attendees
DROP POLICY IF EXISTS "Allow public read access on event_attendees" ON event_attendees;
DROP POLICY IF EXISTS "Allow public insert access on event_attendees" ON event_attendees;
DROP POLICY IF EXISTS "Allow public update access on event_attendees" ON event_attendees;
DROP POLICY IF EXISTS "Allow public delete access on event_attendees" ON event_attendees;

-- Create RLS policies for events (user can only access their own events)
CREATE POLICY "Users can read own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for guests (user can only access their own guests)
CREATE POLICY "Users can read own guests" ON guests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own guests" ON guests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guests" ON guests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own guests" ON guests
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for event_attendees (user can access attendees for their own events)
CREATE POLICY "Users can read attendees for own events" ON event_attendees
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_attendees.event_id AND events.user_id = auth.uid())
  );

CREATE POLICY "Users can insert attendees for own events" ON event_attendees
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_attendees.event_id AND events.user_id = auth.uid())
  );

CREATE POLICY "Users can update attendees for own events" ON event_attendees
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_attendees.event_id AND events.user_id = auth.uid())
  );

CREATE POLICY "Users can delete attendees for own events" ON event_attendees
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_attendees.event_id AND events.user_id = auth.uid())
  );
