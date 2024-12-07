-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set up custom types
DO $$ BEGIN
    CREATE TYPE public.skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.project_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables to resolve foreign key conflicts
DROP TABLE IF EXISTS public.project_skills CASCADE;
DROP TABLE IF EXISTS public.project_images CASCADE;
DROP TABLE IF EXISTS public.skill_images CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.about CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- Create projects table
CREATE TABLE public.projects (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    short_description text,
    technologies text[] DEFAULT '{}' NOT NULL,
    image_url text,
    github_url text,
    live_url text,
    status project_status DEFAULT 'draft' NOT NULL,
    featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    meta_title text,
    meta_description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at timestamp with time zone,
    CONSTRAINT valid_urls CHECK (
        (github_url IS NULL OR github_url ~ '^https?://.*$') AND
        (live_url IS NULL OR live_url ~ '^https?://.*$')
    )
);

-- Create skills table
CREATE TABLE public.skills (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    category text,
    level skill_level NOT NULL,
    proficiency integer CHECK (proficiency >= 0 AND proficiency <= 100),
    years_of_experience numeric(4,1),
    image_url text,
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    color_hex text CHECK (color_hex ~ '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'),
    icon_name text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create project_images table
CREATE TABLE public.project_images (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    storage_path text NOT NULL,
    alt_text text,
    caption text,
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    width integer,
    height integer,
    size_in_bytes bigint,
    mime_type text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_image_url CHECK (image_url ~ '^https?://.*$'),
    CONSTRAINT valid_dimensions CHECK (
        (width IS NULL OR width > 0) AND
        (height IS NULL OR height > 0)
    )
);

-- Create skill_images table
CREATE TABLE public.skill_images (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    storage_path text NOT NULL,
    alt_text text,
    caption text,
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    width integer,
    height integer,
    size_in_bytes bigint,
    mime_type text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_image_url CHECK (image_url ~ '^https?://.*$'),
    CONSTRAINT valid_dimensions CHECK (
        (width IS NULL OR width > 0) AND
        (height IS NULL OR height > 0)
    )
);

-- Create project_skills junction table
CREATE TABLE public.project_skills (
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_demonstrated integer CHECK (proficiency_demonstrated >= 0 AND proficiency_demonstrated <= 100),
    contribution_description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (project_id, skill_id)
);

-- Create about table
CREATE TABLE public.about (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    title text,
    bio text,
    profile_image_url text,
    resume_url text,
    email text,
    github_url text,
    linkedin_url text,
    twitter_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    subject text,
    message text NOT NULL,
    status text DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    replied_at timestamp with time zone
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_name text NOT NULL,
    record_id uuid NOT NULL,
    action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data jsonb,
    new_data jsonb,
    changed_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS projects_slug_idx ON public.projects(slug);
CREATE INDEX IF NOT EXISTS projects_status_idx ON public.projects(status);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON public.projects(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS project_images_project_id_idx ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS project_images_featured_idx ON public.project_images(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS skills_slug_idx ON public.skills(slug);
CREATE INDEX IF NOT EXISTS skills_category_idx ON public.skills(category);
CREATE INDEX IF NOT EXISTS skills_featured_idx ON public.skills(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS skill_images_skill_id_idx ON public.skill_images(skill_id);
CREATE INDEX IF NOT EXISTS project_skills_project_id_idx ON public.project_skills(project_id);
CREATE INDEX IF NOT EXISTS project_skills_skill_id_idx ON public.project_skills(skill_id);

-- Create function for generating slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
BEGIN
    RETURN lower(regexp_replace(regexp_replace(input_text, '[^a-zA-Z0-9\s-]', ''), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Create function for audit logging
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.audit_logs (
        table_name,
        record_id,
        action,
        old_data,
        new_data,
        changed_by
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        auth.uid()
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to automatically update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_images_updated_at
    BEFORE UPDATE ON public.project_images
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skill_images_updated_at
    BEFORE UPDATE ON public.skill_images
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_updated_at
    BEFORE UPDATE ON public.about
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create audit log triggers
CREATE TRIGGER audit_projects_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_skills_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_about_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.about
    FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for published projects" ON public.projects
    FOR SELECT USING (status = 'published');

CREATE POLICY "Enable read access for published project images" ON public.project_images
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id AND p.status = 'published'
    ));

CREATE POLICY "Enable read access for skills" ON public.skills
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for skill images" ON public.skill_images
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for project skills" ON public.project_skills
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id AND p.status = 'published'
    ));

CREATE POLICY "Enable read access for about" ON public.about
    FOR SELECT USING (true);

-- Create policies for admin access
CREATE POLICY "Enable full access for admin users" ON public.projects
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable full access for admin users" ON public.project_images
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable full access for admin users" ON public.skills
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable full access for admin users" ON public.skill_images
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable full access for admin users" ON public.project_skills
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable full access for admin users" ON public.about
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for contact messages
CREATE POLICY "Enable insert for all users" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for admin users" ON public.contact_messages
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable update for admin users" ON public.contact_messages
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for audit logs
CREATE POLICY "Enable read for admin users" ON public.audit_logs
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Add comments for documentation
COMMENT ON TABLE public.projects IS 'Stores portfolio project information';
COMMENT ON TABLE public.project_images IS 'Stores images associated with projects';
COMMENT ON TABLE public.skills IS 'Stores professional skills and technologies';
COMMENT ON TABLE public.skill_images IS 'Stores images associated with skills';
COMMENT ON TABLE public.project_skills IS 'Junction table linking projects with skills';
COMMENT ON TABLE public.about IS 'Stores personal information and social links';
COMMENT ON TABLE public.contact_messages IS 'Stores contact form submissions';
COMMENT ON TABLE public.audit_logs IS 'Tracks changes to important tables';
