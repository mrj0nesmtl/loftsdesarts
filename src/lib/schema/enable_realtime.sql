-- Create a function to check if Realtime is enabled
CREATE OR REPLACE FUNCTION is_realtime_enabled()
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the supabase_realtime publication exists
  RETURN EXISTS (
    SELECT 1 
    FROM pg_publication 
    WHERE pubname = 'supabase_realtime'
  );
END;
$$;

-- Enable Realtime for the messaging tables if not already enabled
DO $$
BEGIN
  -- Check if the publication exists
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Publication exists, add tables to it if they're not already included
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'conversations'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'conversation_participants'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'messages'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'message_read_receipts'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE message_read_receipts;
    END IF;
  ELSE
    -- Publication doesn't exist, create it
    CREATE PUBLICATION supabase_realtime FOR TABLE 
      conversations, 
      conversation_participants, 
      messages, 
      message_read_receipts;
  END IF;
END $$; 