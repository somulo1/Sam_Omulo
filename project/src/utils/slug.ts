/**
 * Generates a URL-friendly slug from a given string
 * @param title - The input string to convert into a slug
 * @returns A URL-friendly slug
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '');    // Remove leading and trailing hyphens
}
