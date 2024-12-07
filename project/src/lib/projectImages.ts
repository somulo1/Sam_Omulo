import { supabase } from './supabaseClient';

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
  url?: string; // Client-side computed URL
}

interface CreateProjectImageParams {
  project_id: string;
  image_url: string;
  storage_path: string;
}

export const createProjectImage = async (
  params: CreateProjectImageParams
): Promise<ProjectImage | null> => {
  const { data, error } = await supabase
    .from('project_images')
    .insert({
      project_id: params.project_id,
      image_url: params.image_url,
      storage_path: params.storage_path
    })
    .select('id, project_id, image_url, storage_path, created_at, updated_at')
    .single();

  if (error) {
    console.error('Error creating project image:', error);
    throw error;
  }

  return data;
};

export const getProjectImages = async (projectId: string): Promise<ProjectImage[]> => {
  const { data, error } = await supabase
    .from('project_images')
    .select('id, project_id, image_url, storage_path, created_at, updated_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching project images:', error);
    return [];
  }

  return data || [];
};

export const deleteProjectImage = async (imageId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', imageId);

  if (error) {
    console.error('Error deleting project image:', error);
    return false;
  }

  return true;
};
