-- Enable Row Level Security for the projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to insert projects
CREATE POLICY "Allow authenticated users to insert projects"
ON projects
FOR INSERT
USING (auth.uid() IS NOT NULL);

-- Policy to allow authenticated users to select their own projects
CREATE POLICY "Allow authenticated users to select their own projects"
ON projects
FOR SELECT
USING (auth.uid() = user_id);

-- Policy to allow authenticated users to update their own projects
CREATE POLICY "Allow authenticated users to update their own projects"
ON projects
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy to allow authenticated users to delete their own projects
CREATE POLICY "Allow authenticated users to delete their own projects"
ON projects
FOR DELETE
USING (auth.uid() = user_id);
