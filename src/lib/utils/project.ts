import type { Database } from '@/lib/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

export function getProjectUrl(project: Project | { id: string }): string {
  if (project.id === 'static-2b-green') {
    return '/project/static-2b-green';
  }
  return `/project/${project.id}`;
}

export function generateProjectSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}