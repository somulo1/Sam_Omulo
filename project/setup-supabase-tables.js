const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function setupSupabaseTables() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Create page_views table
    const { error: pageViewsError } = await supabase.rpc('create_table', {
      table_name: 'page_views',
      table_definition: `
        CREATE TABLE IF NOT EXISTS page_views (
          id SERIAL PRIMARY KEY,
          path TEXT NOT NULL,
          timestamp TIMESTAMPTZ DEFAULT NOW(),
          metadata JSONB
        )
      `
    });

    if (pageViewsError) throw pageViewsError;

    // Create user_events table
    const { error: userEventsError } = await supabase.rpc('create_table', {
      table_name: 'user_events',
      table_definition: `
        CREATE TABLE IF NOT EXISTS user_events (
          id SERIAL PRIMARY KEY,
          event_name TEXT NOT NULL,
          event_properties JSONB,
          timestamp TIMESTAMPTZ DEFAULT NOW(),
          user_id UUID REFERENCES auth.users(id)
        )
      `
    });

    if (userEventsError) throw userEventsError;

    // Create RPC function to dynamically create tables
    const { error: rpcError } = await supabase.rpc('create_table_function', {
      function_definition: `
        CREATE OR REPLACE FUNCTION create_table(table_name TEXT, table_definition TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE table_definition;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (rpcError) throw rpcError;

    console.log('Supabase tables and functions created successfully!');
  } catch (error) {
    console.error('Error setting up Supabase tables:', error);
    process.exit(1);
  }
}

setupSupabaseTables();
