-- Create project_images table
create table if not exists project_images (
    id uuid default uuid_generate_v4() primary key,
    project_id uuid references projects(id) on delete cascade,
    image_url text not null,
    storage_path text not null,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create index for faster lookups
create index if not exists idx_project_images_project_id on project_images(project_id);

-- Set up RLS policies
alter table project_images enable row level security;

create policy "Public project_images are viewable by everyone"
    on project_images for select
    using (true);

create policy "Project images can be inserted by authenticated users"
    on project_images for insert
    with check (auth.role() = 'authenticated');

create policy "Project images can be updated by authenticated users"
    on project_images for update
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

create policy "Project images can be deleted by authenticated users"
    on project_images for delete
    using (auth.role() = 'authenticated');
