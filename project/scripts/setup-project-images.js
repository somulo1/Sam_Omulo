import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the project root
dotenv.config({ path: join(__dirname, '..', '.env') });

async function setupProjectImages() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or Service Role Key is missing');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Update projects table to include user_id
    const { error: projectsUpdateError } = await supabase.rpc('execute_sql', {
      sql_statement: `
        -- Add user_id column to projects if it doesn't exist
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'projects' 
            AND column_name = 'user_id'
          ) THEN
            ALTER TABLE projects ADD COLUMN user_id UUID REFERENCES auth.users(id);
          END IF;
        END $$;

        -- Make user_id NOT NULL for new records
        ALTER TABLE projects ALTER COLUMN user_id SET NOT NULL;

        -- Enable RLS on projects table
        ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

        -- Drop existing policies
        DROP POLICY IF EXISTS "Public users can view projects" ON projects;
        DROP POLICY IF EXISTS "Users can manage their own projects" ON projects;
        DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
        DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
        DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

        -- Create new policies
        CREATE POLICY "Public users can view projects"
          ON projects FOR SELECT
          USING (true);

        CREATE POLICY "Users can insert their own projects"
          ON projects FOR INSERT
          WITH CHECK (
            auth.uid() IS NOT NULL AND
            auth.uid() = user_id
          );

        CREATE POLICY "Users can update their own projects"
          ON projects FOR UPDATE
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own projects"
          ON projects FOR DELETE
          USING (auth.uid() = user_id);
      `
    });

    if (projectsUpdateError) {
      console.error('Error updating projects table:', projectsUpdateError);
      throw projectsUpdateError;
    }

    // Create the project_images table with all required fields
    const { error: createTableError } = await supabase.rpc('execute_sql', {
      sql_statement: `
        CREATE TABLE IF NOT EXISTS project_images (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          project_id UUID NOT NULL,
          image_url TEXT NOT NULL,
          storage_path TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        );
      `
    });

    if (createTableError) {
      console.error('Error creating table:', createTableError);
      throw createTableError;
    }

    // Enable RLS and create policies
    const { error: rlsError } = await supabase.rpc('execute_sql', {
      sql_statement: `
        -- Enable RLS
        ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

        -- Drop existing policies
        DROP POLICY IF EXISTS "Public users can view project images" ON project_images;
        DROP POLICY IF EXISTS "Users can manage project images" ON project_images;

        -- Create new policies
        CREATE POLICY "Public users can view project images"
          ON project_images FOR SELECT
          USING (true);

        CREATE POLICY "Users can manage project images"
          ON project_images FOR ALL
          USING (
            EXISTS (
              SELECT 1 FROM projects
              WHERE projects.id = project_images.project_id
              AND projects.user_id = auth.uid()
            )
          )
          WITH CHECK (
            EXISTS (
              SELECT 1 FROM projects
              WHERE projects.id = project_images.project_id
              AND projects.user_id = auth.uid()
            )
          );
      `
    });

    if (rlsError) {
      console.error('Error setting up RLS policies:', rlsError);
      throw rlsError;
    }

    // Create trigger for updated_at
    const { error: triggerError } = await supabase.rpc('execute_sql', {
      sql_statement: `
        -- Create or replace the trigger function
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        -- Drop the trigger if it exists
        DROP TRIGGER IF EXISTS update_project_images_updated_at ON project_images;

        -- Create the trigger
        CREATE TRIGGER update_project_images_updated_at
          BEFORE UPDATE ON project_images
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (triggerError) {
      console.error('Error setting up trigger:', triggerError);
      throw triggerError;
    }

    console.log('Project images table and policies created successfully!');
  } catch (error) {
    console.error('Error setting up project images:', error);
    process.exit(1);
  }
}

setupProjectImages();
