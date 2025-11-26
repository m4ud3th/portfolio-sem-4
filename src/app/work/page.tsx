'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getProjectUrl } from '@/lib/utils/project';
import AuthAwareAdminLink from '@/components/AuthAwareAdminLink';
import type { Database } from '@/lib/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

export default function WorkPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient();
        if (supabase) {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            setProjects(data);
          }
        }
      } catch (error) {
        console.log('Database not connected yet, using empty data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const getValidImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) return '/images/2b-green.png';
    
    try {
      let normalizedPath = imageUrl.replace(/\\/g, '/');
      if (!normalizedPath.startsWith('/') && !normalizedPath.startsWith('http')) {
        normalizedPath = `/${normalizedPath}`;
      }
      if (normalizedPath.startsWith('/')) {
        return normalizedPath;
      }
      new URL(normalizedPath);
      return normalizedPath;
    } catch (error) {
      console.error('Invalid image URL:', imageUrl, error);
      return '/images/2b-green.png';
    }
  };

  const truncateDescription = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-gradient-to-br from-black via-[#181a20] to-[#232842] relative overflow-x-hidden">
      {/* Grungy Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-overlay" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/diamond-upholstery.png), url(https://www.transparenttextures.com/patterns/grunge-wall.png)'}} />
      
      {/* Header */}
      <header className="w-full bg-black/90 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 py-6 border-b-2 border-[#232842] z-20 relative shadow-xl tracking-widest">
        <Link
          href="/"
          className="text-3xl md:text-4xl font-black text-white select-none tracking-widest drop-shadow-lg hover:text-[#6a5cff] transition-colors duration-200 cursor-pointer"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          <span className="block sm:hidden">MK</span>
          <span className="hidden sm:block">M Kusters</span>
        </Link>
        <nav className="flex gap-6">
          <Link
            href="/#contact"
            className="text-white bg-transparent rounded px-5 py-2 font-bold text-lg hover:text-[#6a5cff] hover:bg-[#232842]/30 hover:scale-105 transition-all duration-200 shadow-sm tracking-wide cursor-pointer"
          >
            Contact
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-4 py-16 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-widest uppercase">
            My Work
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A collection of projects I&apos;ve worked on. From web development to creative coding experiments.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6a5cff]"></div>
            <p className="text-gray-300 mt-4">Loading projects...</p>
          </div>
        )}

        {/* No Projects */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-300 text-xl">No projects available yet.</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="project-grid">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-lg flex flex-col h-full transition-all duration-300 hover:scale-[1.025] hover:shadow-[0_20px_50px_rgba(106,92,255,0.3)] hover:border-[#6a5cff]/40 hover:bg-white/10 group animate-fade-in-up cursor-pointer"
                style={{animationDelay: `${0.1 * index}s`}}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest('a') && !target.closest('button')) {
                    router.push(getProjectUrl(project));
                  }
                }}
              >
                {/* Card Header with Icon */}
                <div className="flex items-center gap-2 px-5 pt-5 pb-3 w-full h-[5rem]">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#6a5cff] text-lg font-bold shadow-sm group-hover:bg-[#6a5cff]/30 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75v16.5m-9-16.5v16.5M3.75 7.5h16.5m-16.5 9h16.5" />
                    </svg>
                  </span>
                  <div className="flex-1 h-full flex items-center">
                    <h4 className="font-semibold text-lg text-white tracking-wide hover:text-[#6a5cff] transition-colors duration-200 leading-tight">
                      {project.title}
                    </h4>
                  </div>
                  {project.featured && (
                    <span className="px-2 py-1 bg-[#6a5cff] text-white text-xs rounded font-bold tracking-wide">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Image Section */}
                <div className="w-full h-[200px] bg-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden relative border-y border-white/10">
                  <Image
                    src={getValidImageUrl(project.image_url)} 
                    alt={`${project.title} preview`} 
                    width={400}
                    height={200}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 group-hover:from-[#6a5cff]/10 group-hover:to-[#6a5cff]/5 transition-all duration-300"></div>
                </div>

                <div className="flex-1 flex flex-col items-start px-5 py-4 w-full">
                  <div className="border-b border-[#232842]/30 w-full mb-3" />
                  
                  {/* Project Date */}
                  {project.project_date && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-[#232842]/60 text-gray-400 text-xs rounded font-medium tracking-wide">
                        {project.project_date}
                      </span>
                    </div>
                  )}
                  
                  {/* Description */}
                  <div className="h-[4.2rem] mb-3">
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {truncateDescription(project.description)}
                    </p>
                  </div>
                  
                  {/* Technologies */}
                  <div className="min-h-[3rem] mb-4 flex items-start">
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 text-xs rounded hover:bg-[#6a5cff]/30 hover:text-white hover:border-[#6a5cff]/50 transition-all duration-200 cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 w-full">
                    <Link
                      href={getProjectUrl(project)}
                      className="flex-1 text-center border border-[#6a5cff]/50 text-white font-medium rounded px-3 py-2 bg-white/10 backdrop-blur-sm hover:bg-[#6a5cff]/60 hover:text-white hover:scale-105 hover:border-[#6a5cff] transition-all duration-200 text-sm shadow-sm tracking-wide cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details
                    </Link>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        className="flex-1 text-center border border-gray-500/50 text-gray-300 font-medium rounded px-3 py-2 bg-white/10 backdrop-blur-sm hover:bg-gray-500/60 hover:text-white hover:scale-105 hover:border-gray-400 transition-all duration-200 text-sm shadow-sm tracking-wide cursor-pointer"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-black/90 backdrop-blur-sm text-center text-gray-400 text-base border-t-2 border-[#232842]/40 mt-16 relative z-10 rounded-t-xl shadow-lg tracking-widest uppercase">
        <p>&copy; {new Date().getFullYear()} Maud Kusters. All rights reserved.</p>
        <div className="mt-2">
          <AuthAwareAdminLink />
        </div>
      </footer>
    </div>
  );
}
