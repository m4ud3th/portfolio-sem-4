'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Database } from '@/lib/types/database.types';
import { createClient } from '@/lib/supabase/client';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const resolvedParams = await params;
      
      try {
        const supabase = createClient();
        
        if (!supabase) {
          console.error('Supabase client not available');
          setProject(null);
          return;
        }
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (error) {
          console.error('Error fetching project:', error);
          setProject(null);
        } else {
          setProject(data);
        }
      } catch (error) {
        console.error('Supabase not configured or error:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  // Function to normalize and validate image URLs
  const getValidImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) return '/images/2b-green.png';
    
    try {
      // Normalize the path: replace backslashes with forward slashes
      let normalizedPath = imageUrl.replace(/\\/g, '/');
      
      // Ensure it starts with a forward slash for absolute paths
      if (!normalizedPath.startsWith('/') && !normalizedPath.startsWith('http')) {
        normalizedPath = `/${normalizedPath}`;
      }
      
      // Test if it's a valid URL structure for Next.js Image
      if (normalizedPath.startsWith('/')) {
        return normalizedPath;
      }
      
      // If it's an external URL, validate it
      new URL(normalizedPath);
      return normalizedPath;
    } catch (error) {
      console.error('Invalid image URL:', imageUrl, error);
      return '/images/2b-green.png'; // Fallback to default image
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-black relative overflow-x-hidden">
      {/* Grungy Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-overlay" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/diamond-upholstery.png), url(https://www.transparenttextures.com/patterns/grunge-wall.png)'}} />
      
      {/* Header */}
      <header className="w-full bg-black/90 flex items-center justify-between px-4 md:px-8 py-6 border-b-2 border-[#232842] z-20 relative shadow-xl tracking-widest">
        <Link
          href="/"
          className="text-3xl md:text-4xl font-black text-white select-none tracking-widest drop-shadow-lg hover:text-[#6a5cff] transition-colors duration-200 cursor-pointer"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          <span className="block sm:hidden">MK</span>
          <span className="hidden sm:block">M Kusters</span>
        </Link>
        <Link
          href="/"
          className="text-white bg-transparent rounded px-5 py-2 font-bold text-lg hover:text-[#6a5cff] hover:bg-[#232842]/30 transition-colors duration-200 shadow-sm tracking-wide cursor-pointer"
        >
          ← Back to Portfolio
        </Link>
      </header>

      {/* Project Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-4 py-10 relative z-10">
        <div className="bg-[#181b23] rounded-2xl border border-[#232842]/40 p-8 shadow-2xl">
          {/* Project Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-widest uppercase">
              {project.title}
            </h1>
            {project.featured && (
              <span className="inline-block px-4 py-2 bg-[#6a5cff] text-white text-sm rounded-full font-bold uppercase tracking-wide">
                Featured Project
              </span>
            )}
          </div>

          {/* Project Image */}
          {project.image_url && (
            <div className="w-full max-w-4xl mx-auto mb-8 rounded-xl overflow-hidden shadow-xl border border-[#232842]/30">
              <Image
                src={getValidImageUrl(project.image_url)}
                alt={`${project.title} preview`}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
                onError={(e) => {
                  console.error('Image failed to load:', project.image_url);
                }}
              />
            </div>
          )}

          {/* Project Details */}
          <div className="max-w-3xl mx-auto">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 tracking-wide uppercase">About This Project</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 tracking-wide uppercase">Technologies Used</h2>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-[#232842]/60 text-gray-300 rounded-lg border border-[#232842]/40 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-[#232842]/40">
              {project.project_url && project.project_url !== '#' && (
                <a
                  href={project.project_url}
                  className="inline-block text-center px-8 py-3 bg-[#6a5cff] text-white font-bold rounded-lg hover:bg-[#6a5cff]/80 transition-all text-lg shadow-lg tracking-wide uppercase cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Live Project
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  className="inline-block text-center px-8 py-3 border-2 border-gray-500 text-gray-300 font-bold rounded-lg hover:bg-gray-600 hover:text-white transition-all text-lg shadow-lg tracking-wide uppercase cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Back to Portfolio */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block px-6 py-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Back to All Projects
          </Link>
        </div>
      </main>
    </div>
  );
}