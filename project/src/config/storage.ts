import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined in environment variables');
}

export const STORAGE_URL = `${supabaseUrl}/storage/v1/object/public`;

export const BUCKET_NAMES = {
  PORTFOLIO_IMAGES: 'portfolio-images',
  PROFILE_PHOTOS: 'profile-photos',
  SKILL_ICONS: 'skill-icons',
} as const;

export const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/svg+xml': ['.svg'], // Added for skill icons
  },
  defaultThumbnailSize: 200,
  skillIconSize: 64, // Default size for skill icons
} as const;

export interface StorageImage {
  url: string;
  path: string;
  bucket: keyof typeof BUCKET_NAMES;
}

/**
 * Generates a unique filename for a project image
 * @param projectId - ID of the project
 * @param originalFilename - Original filename to preserve extension
 * @returns Unique filename with project path
 */
export function generateProjectImagePath(projectId: string, originalFilename: string): string {
  const fileExt = originalFilename.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  return `${uuidv4()}_${timestamp}.${fileExt}`;
}

/**
 * Generates a unique filename for a skill icon
 * @param skillId - ID of the skill
 * @param originalFilename - Original filename to preserve extension
 * @returns Unique filename with skill path
 */
export function generateSkillIconPath(skillId: string, originalFilename: string): string {
  const fileExt = originalFilename.split('.').pop() || 'svg';
  const timestamp = Date.now();
  return `${uuidv4()}_${timestamp}.${fileExt}`;
}

/**
 * Generates a public URL for an object in Supabase Storage
 * @param bucketName - Name of the storage bucket
 * @param filePath - Path to the file within the bucket
 * @returns Full URL to access the file
 */
export function getStorageUrl(bucketName: keyof typeof BUCKET_NAMES, filePath: string): string {
  return `${STORAGE_URL}/${bucketName}/${filePath}`;
}

/**
 * Extracts the file path from a full storage URL
 * @param url - Full storage URL
 * @returns The file path portion of the URL
 */
export function getFilePathFromUrl(url: string): string | null {
  try {
    const storageUrlBase = `${STORAGE_URL}/`;
    if (!url.startsWith(storageUrlBase)) {
      return null;
    }
    
    // Remove the base storage URL to get the bucket and file path
    const pathPart = url.substring(storageUrlBase.length);
    
    // Split into bucket name and file path
    const [bucketName, ...filePathParts] = pathPart.split('/');
    
    // Return just the file path portion
    return filePathParts.join('/');
  } catch (error) {
    console.error('Error parsing storage URL:', error);
    return null;
  }
}

/**
 * Gets the bucket name from a full storage URL
 * @param url - Full storage URL
 * @returns The bucket name or null if invalid URL
 */
export function getBucketFromUrl(url: string): string | null {
  try {
    const storageUrlBase = `${STORAGE_URL}/`;
    if (!url.startsWith(storageUrlBase)) {
      return null;
    }
    
    // Remove the base storage URL to get the bucket and file path
    const pathPart = url.substring(storageUrlBase.length);
    
    // Return just the bucket name
    return pathPart.split('/')[0];
  } catch (error) {
    console.error('Error getting bucket from URL:', error);
    return null;
  }
}

/**
 * Validates if a file meets the image requirements
 * @param file - File to validate
 * @param isSkillIcon - If true, allows SVG files and enforces stricter size limits
 * @returns true if valid, throws error if invalid
 */
export function validateImageFile(file: File, isSkillIcon: boolean = false): boolean {
  if (!file) {
    throw new Error('No file provided');
  }

  if (file.size > IMAGE_CONFIG.maxSize) {
    throw new Error(`File size must be less than ${IMAGE_CONFIG.maxSize / (1024 * 1024)}MB`);
  }

  const acceptedTypes = Object.keys(IMAGE_CONFIG.acceptedTypes);
  if (!acceptedTypes.includes(file.type)) {
    const allowedTypes = isSkillIcon 
      ? 'Only JPG, PNG, WebP, and SVG files are allowed for skill icons'
      : 'Only JPG, PNG, and WebP files are allowed';
    throw new Error(`Invalid file type. ${allowedTypes}.`);
  }

  return true;
}

/**
 * Creates a thumbnail URL from a full image URL
 * @param url - Original image URL
 * @param size - Desired thumbnail size
 * @param isSkillIcon - If true, uses skill icon specific settings
 * @returns Thumbnail URL
 */
export function getThumbnailUrl(
  url: string, 
  size: number = IMAGE_CONFIG.defaultThumbnailSize,
  isSkillIcon: boolean = false
): string {
  const filePath = getFilePathFromUrl(url);
  const bucket = getBucketFromUrl(url);
  
  if (!filePath || !bucket) {
    return url;
  }

  // Don't transform SVG files
  if (filePath.toLowerCase().endsWith('.svg')) {
    return url;
  }

  // Use specific size for skill icons if no size provided
  const finalSize = isSkillIcon && size === IMAGE_CONFIG.defaultThumbnailSize 
    ? IMAGE_CONFIG.skillIconSize 
    : size;

  // Add Supabase image transformation parameters
  return `${STORAGE_URL}/${bucket}/${filePath}?width=${finalSize}&height=${finalSize}&resize=contain`;
}
