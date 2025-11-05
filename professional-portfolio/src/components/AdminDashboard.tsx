"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

// Define proper error type interface
interface SupabaseError {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
}

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: '',
    featured: false,
    project_date: '',
  });
  const router = useRouter();
  
  // Check if Supabase is configured
  const isConfigured = isSupabaseConfigured();
  const supabase = isConfigured ? createClient() : null;

  const fetchProjects = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (isConfigured && supabase) {
      fetchProjects();
    }
  }, [isConfigured, supabase, fetchProjects]);

  // If Supabase is not configured, show setup message
  if (!isConfigured || !supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#181a20] to-[#232842] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#181b23] rounded-2xl border border-[#232842]/40 p-8 shadow-2xl text-center">
          <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-4">
            Setup Required
          </h2>
          <p className="text-gray-300 mb-6">
            Supabase configuration is needed to access the admin dashboard.
          </p>
          <a
            href="/setup"
            className="inline-block px-6 py-3 bg-[#6a5cff] text-white rounded-lg hover:bg-[#6a5cff]/80 transition-colors cursor-pointer"
          >
            View Setup Guide
          </a>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      project_url: '',
      github_url: '',
      technologies: '',
      featured: false,
      project_date: '',
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }
    
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
      user_id: user.id,
      // Ensure project_date has a default value if empty
      project_date: formData.project_date.trim() || 'No date specified'
    };

    console.log('Attempting to save project data:', projectData);
    console.log('Form data before processing:', formData);
    
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in the title and description fields');
      return;
    }

    try {
      if (editingProject) {
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)
          .select()
          .single();
        
        if (error) {
          console.error('Update error details:', error);
          console.error('Error message:', error.message);
          console.error('Error code:', error.code);
          console.error('Error details:', error.details);
          console.error('Error hint:', error.hint);
          throw error;
        }
        console.log('Project updated successfully:', data);
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();
        
        if (error) {
          console.error('Insert error details:', error);
          console.error('Error message:', error.message);
          console.error('Error code:', error.code);
          console.error('Error details:', error.details);
          console.error('Error hint:', error.hint);
          throw error;
        }
        console.log('Project created successfully:', data);
      }

      await fetchProjects();
      resetForm();
      alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      
      // Try to extract useful error information
      const supabaseError = error as SupabaseError;
      if (error && typeof error === 'object') {
        console.error('Error message:', supabaseError.message);
        console.error('Error details:', supabaseError.details);
        console.error('Error hint:', supabaseError.hint);
        console.error('Error code:', supabaseError.code);
      }
      
      // Show user-friendly error message
      const errorMessage = supabaseError?.message || 
                          supabaseError?.details || 
                          supabaseError?.hint || 
                          'Unknown error occurred';
      alert(`Failed to save project: ${errorMessage}`);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url || '',
      project_url: project.project_url || '',
      github_url: project.github_url || '',
      technologies: project.technologies.join(', '),
      featured: project.featured,
      project_date: project.project_date || '',
    });
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#181a20] to-[#232842] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#181a20] to-[#232842] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase">Admin Dashboard</h1>
            <p className="text-gray-300 mt-2">Welcome back, {user.email}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Portfolio
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Add Project Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-[#6a5cff] hover:bg-[#6a5cff]/80 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            {showForm ? 'Cancel' : 'Add New Project'}
          </button>
        </div>

        {/* Project Form */}
        {showForm && (
          <div className="bg-[#181b23] rounded-2xl border border-[#232842]/40 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                    placeholder="React, TypeScript, Tailwind"
                    className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="/images/project.png or https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project URL</label>
                  <input
                    type="text"
                    value={formData.project_url}
                    onChange={(e) => setFormData({...formData, project_url: e.target.value})}
                    placeholder="https://example.com or leave empty"
                    className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                  <input
                    type="text"
                    value={formData.github_url}
                    onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                    placeholder="https://github.com/username/repo or leave empty"
                    className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Date</label>
                <input
                  type="text"
                  value={formData.project_date}
                  onChange={(e) => setFormData({...formData, project_date: e.target.value})}
                  placeholder="e.g., March 2024"
                  className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="featured" className="text-sm text-gray-300">Featured Project</label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#6a5cff] hover:bg-[#6a5cff]/80 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {editingProject ? 'Update Project' : 'Add Project'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div className="bg-[#181b23] rounded-2xl border border-[#232842]/40 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Your Projects ({projects.length})</h2>
          
          {projects.length === 0 ? (
            <p className="text-gray-300 text-center py-8">No projects yet. Add your first project!</p>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-[#232842]/40 rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{project.title}</h3>
                      {project.featured && (
                        <span className="px-2 py-1 bg-[#6a5cff] text-white text-xs rounded font-bold">FEATURED</span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-[#232842]/40 text-gray-300 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 text-sm text-gray-400">
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#6a5cff] cursor-pointer">
                          Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#6a5cff] cursor-pointer">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}