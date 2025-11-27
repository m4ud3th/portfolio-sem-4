'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getProjectUrl } from '@/lib/utils/project';
import Footer from '@/components/Footer';
import type { Database } from '@/lib/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

export default function WorkPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>('date-desc');
  const [allTechnologies, setAllTechnologies] = useState<string[]>([]);

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
            
            // Extract all unique technologies
            const techSet = new Set<string>();
            data.forEach(project => {
              project.technologies.forEach((tech: string) => techSet.add(tech));
            });
            setAllTechnologies(Array.from(techSet).sort());
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

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      if (selectedTech === 'all') return true;
      return project.technologies.includes(selectedTech);
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.project_date).getTime() - new Date(a.project_date).getTime();
      } else if (sortBy === 'date-asc') {
        return new Date(a.project_date).getTime() - new Date(b.project_date).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

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
      /* Grungy Texture Overlay */
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-overlay" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/diamond-upholstery.png), url(https://www.transparenttextures.com/patterns/grunge-wall.png)'}} />

      {/* Reusable Navbar Component */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Spacer for fixed navbar height */}
      <div className="h-[72px] md:h-[80px]" />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-4 py-16 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-widest uppercase">
            My Work
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A collection of projects I&apos;ve worked on. From web development to creative coding experiments.
          </p>
        </div>

        {/* Filters and Sorting */}
        {!loading && projects.length > 0 && (
          <div className="mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl hover:shadow-[0_20px_50px_rgba(106,92,255,0.15)] transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
                {/* Technology Filter */}
                <div className="flex flex-col gap-3 flex-1 w-full lg:w-auto">
                  <label className="text-xs font-bold text-gray-400 tracking-[0.15em] uppercase flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                    </svg>
                    Filter by Technology
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTech}
                      onChange={(e) => setSelectedTech(e.target.value)}
                      className="w-full bg-[#232842]/80 text-white border border-white/20 rounded-xl px-5 py-3 pr-10 font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-[#6a5cff] focus:border-[#6a5cff]/50 transition-all duration-200 cursor-pointer hover:bg-[#232842] hover:border-[#6a5cff]/30 shadow-lg appearance-none"
                    >
                      <option value="all">All Technologies</option>
                      {allTechnologies.map(tech => (
                        <option key={tech} value={tech}>{tech}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#6a5cff]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[200px]">
                  <label className="text-xs font-bold text-gray-400 tracking-[0.15em] uppercase flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'date-desc' | 'date-asc' | 'title')}
                      className="w-full bg-[#232842]/80 text-white border border-white/20 rounded-xl px-5 py-3 pr-10 font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-[#6a5cff] focus:border-[#6a5cff]/50 transition-all duration-200 cursor-pointer hover:bg-[#232842] hover:border-[#6a5cff]/30 shadow-lg appearance-none"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="title">Title (A-Z)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#6a5cff]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Results Count & Clear Filters */}
                <div className="flex flex-col gap-3 w-full lg:w-auto">
                  <label className="text-xs font-bold text-gray-400 tracking-[0.15em] uppercase opacity-0 pointer-events-none">
                    Actions
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="px-5 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                      <span className="text-white font-bold tracking-wide">
                        {filteredAndSortedProjects.length}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">
                        {filteredAndSortedProjects.length === 1 ? 'project' : 'projects'}
                      </span>
                    </div>
                    {(selectedTech !== 'all' || sortBy !== 'date-desc') && (
                      <button
                        onClick={() => {
                          setSelectedTech('all');
                          setSortBy('date-desc');
                        }}
                        className="px-4 py-3 bg-white/5 hover:bg-[#6a5cff]/20 border border-white/10 hover:border-[#6a5cff]/50 text-gray-300 hover:text-white rounded-xl transition-all duration-200 font-medium tracking-wide group flex items-center gap-2"
                        title="Clear all filters"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="hidden sm:inline">Clear</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* No Results After Filtering */}
        {!loading && projects.length > 0 && filteredAndSortedProjects.length === 0 && (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">No Projects Found</h3>
            <p className="text-gray-400 text-lg mb-6">No projects match the selected filters.</p>
            <button
              onClick={() => {
                setSelectedTech('all');
                setSortBy('date-desc');
              }}
              className="px-8 py-3 bg-[#6a5cff] hover:bg-[#5a4cef] text-white rounded-xl font-bold tracking-wide transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-[0_10px_30px_rgba(106,92,255,0.4)] flex items-center gap-2 mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Reset Filters
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && filteredAndSortedProjects.length > 0 && (
          <div className="project-grid">
            {filteredAndSortedProjects.map((project, index) => (
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
                        {project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex} 
                            className={`px-2 py-1 backdrop-blur-sm border text-xs rounded transition-all duration-200 cursor-pointer ${
                              selectedTech === tech 
                                ? 'bg-[#6a5cff]/60 text-white border-[#6a5cff]' 
                                : 'bg-white/10 border-white/20 text-gray-300 hover:bg-[#6a5cff]/30 hover:text-white hover:border-[#6a5cff]/50'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTech(tech);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
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

      {/* Reusable Footer Component */}
      <Footer />
    </div>
  );
}
