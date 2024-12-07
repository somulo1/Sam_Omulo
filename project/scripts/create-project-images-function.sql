-- Function to execute SQL for setting up project images policies
CREATE OR REPLACE FUNCTION setup_project_images_policies(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
