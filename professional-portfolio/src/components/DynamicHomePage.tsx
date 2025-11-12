"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AuthAwareAdminLink from './AuthAwareAdminLink';
import { getProjectUrl } from '@/lib/utils/project';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

interface DynamicHomePageProps {
  projects: Project[];
}

export default function DynamicHomePage({ projects: initialProjects }: DynamicHomePageProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(true);

  // Fetch projects client-side to avoid server-side cookie issues
  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient();
        if (supabase) {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('featured', true)
            .order('created_at', { ascending: false });

          if (!error && data) {
            setProjects(data);
          }
        }
      } catch (error) {
        console.log('Database not connected yet, using static data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#work") {
        const el = document.getElementById(hash.substring(1));
        if (el) {
          const headerHeight = 80; // Approximate header height
          const elementPosition = el.offsetTop;
          const offsetPosition = elementPosition - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    }
  }, []);

  // Full-page snap scrolling between sections
  useEffect(() => {
    let lastScrollTop = 0;
    let lastScrollTime = Date.now();
    let scrollTimeout: NodeJS.Timeout;
    let isQuickScrolling = false;
    let isScrolling = false;

    const getSections = () => {
      const headerHeight = 80;
      const workSection = document.getElementById('work');
      const contactSection = document.getElementById('contact');
      
      return [
        { name: 'top', position: 0 },
        { name: 'work', position: (workSection?.offsetTop || 0) - headerHeight },
        { name: 'contact', position: (contactSection?.offsetTop || 0) - headerHeight }
      ];
    };

    const getCurrentSection = (scrollTop: number) => {
      const sections = getSections();
      let currentSection = sections[0];
      
      for (const section of sections) {
        if (scrollTop >= section.position - 100) {
          currentSection = section;
        }
      }
      
      return currentSection;
    };

    const getNextSection = (scrollTop: number, scrollingDown: boolean) => {
      const sections = getSections();
      const currentSection = getCurrentSection(scrollTop);
      const currentIndex = sections.findIndex(s => s.name === currentSection.name);
      
      if (scrollingDown && currentIndex < sections.length - 1) {
        return sections[currentIndex + 1];
      } else if (!scrollingDown && currentIndex > 0) {
        return sections[currentIndex - 1];
      }
      
      return currentSection;
    };

    const handleScroll = () => {
      if (isScrolling) return;

      const currentTime = Date.now();
      const scrollTop = window.scrollY;

      // Calculate scroll speed (pixels per millisecond)
      const timeDiff = currentTime - lastScrollTime;
      const scrollDiff = Math.abs(scrollTop - lastScrollTop);
      const scrollSpeed = timeDiff > 0 ? scrollDiff / timeDiff : 0;

      // Determine scroll direction
      const scrollingDown = scrollTop > lastScrollTop;
      
      // Detect quick scrolling (threshold: 2 pixels per millisecond)
      if (scrollSpeed > 2) {
        isQuickScrolling = true;
        clearTimeout(scrollTimeout);
      } else if (scrollSpeed < 0.5) {
        isQuickScrolling = false;
      }

      lastScrollTop = scrollTop;
      lastScrollTime = currentTime;

      // Don't snap if user is quickly scrolling
      if (isQuickScrolling) {
        return;
      }

      // Clear existing timeout
      clearTimeout(scrollTimeout);

      // Set new timeout for smooth snap
      scrollTimeout = setTimeout(() => {
        if (!isQuickScrolling && !isScrolling) {
          const sections = getSections();
          const currentScrollTop = window.scrollY;
          
          // Find the closest section we're near
          let closestSection = sections[0];
          let minDistance = Math.abs(currentScrollTop - sections[0].position);
          
          for (const section of sections) {
            const distance = Math.abs(currentScrollTop - section.position);
            if (distance < minDistance) {
              minDistance = distance;
              closestSection = section;
            }
          }
          
          // Determine if we should snap to next/previous section based on scroll direction
          const currentIndex = sections.findIndex(s => s.name === closestSection.name);
          let targetSection = closestSection;
          
          // If we're between sections, decide which one to snap to
          if (minDistance > 50) {
            if (scrollingDown && currentIndex < sections.length - 1) {
              targetSection = sections[currentIndex + 1];
            } else if (!scrollingDown && currentIndex > 0) {
              targetSection = sections[currentIndex - 1];
            }
          }
          
          // Snap to target section if we're not already there
          if (Math.abs(currentScrollTop - targetSection.position) > 20) {
            isScrolling = true;
            window.scrollTo({
              top: targetSection.position,
              behavior: 'smooth'
            });
            
            // Reset scrolling flag after animation
            setTimeout(() => {
              isScrolling = false;
            }, 800);
          }
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Fallback static project if no dynamic projects
  const staticProject = {
    id: 'static-2b-green',
    title: '2B Green',
    description: 'A web project I built as part of my first internship. I learned a lot about React, teamwork, and building real-world features.',
    image_url: '/images/2b-green.png',
    project_url: '#',
    github_url: null,
    technologies: ['React', 'TypeScript', 'Tailwind'],
    featured: true,
    project_date: 'March 2024',
    created_at: '',
    updated_at: '',
    user_id: ''
  };

  const displayProjects = (loading || projects.length === 0) ? [staticProject] : projects;

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

  // Function to truncate description text
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-black relative overflow-x-hidden scroll-smooth">
      {/* Grungy Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-overlay" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/diamond-upholstery.png), url(https://www.transparenttextures.com/patterns/grunge-wall.png)'}} />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#6a5cff]/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-[#6a5cff]/10 rounded-full blur-lg animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-[#232842]/30 rounded-full blur-md animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Bold Band-style Header */}
      <header className="w-full bg-black/90 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 py-6 border-b-2 border-[#232842] z-20 relative shadow-xl tracking-widest">
        <div className="flex items-center">
          <HomeNavButton />
        </div>
        <nav className="flex items-center gap-6">
          <WorkScrollButton />
          <a
            href="/contact"
            className="text-white bg-transparent rounded px-5 py-2 font-bold text-lg hover:text-[#6a5cff] hover:bg-[#232842]/30 hover:scale-105 transition-all duration-200 shadow-sm tracking-wide cursor-pointer"
          >
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section - Big, Centered, Band-like */}
      <section className="flex flex-col items-center justify-center text-center w-full pt-24 pb-20 px-6 md:px-4 relative z-10 border-b-2 border-[#232842]/40 bg-gradient-to-b from-black/90 via-[#181b23]/80 to-transparent">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-widest drop-shadow-xl uppercase hover:text-[#6a5cff] transition-colors duration-300" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            Maud Kusters
          </h1>
        </div>
        <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <h2 className="text-xl md:text-2xl text-gray-200 mb-6 font-semibold tracking-wider uppercase">
            <span className="inline-block">Creative</span>
            <span className="inline-block mx-2 text-[#6a5cff]">Coding</span>
            <span className="inline-block">Student</span>
          </h2>
        </div>
        <div className="animate-fade-in-up max-w-2xl mx-auto px-4" style={{animationDelay: '0.4s'}}>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Hi! I&apos;m Maud, a college student passionate about web development and digital design. Here you&apos;ll find a selection of my projects. I&apos;m always learning and excited to take on new challenges.
          </p>
        </div>
        <div className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <ContactScrollButton />
        </div>
      </section>

      {/* Projects Section - Merch Grid Inspired */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-4 py-10">
        <section id="work" className="relative z-10">
          <div className="animate-fade-in-up">
            <h3 className="text-3xl font-black mb-10 text-white text-center tracking-widest uppercase border-b-2 border-[#232842]/40 pb-4 hover:text-[#6a5cff] transition-colors duration-300">Featured Projects</h3>
          </div>
          <div className="project-grid">
            {displayProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-lg flex flex-col h-full transition-all duration-300 hover:scale-[1.025] hover:shadow-[0_20px_50px_rgba(106,92,255,0.3)] hover:border-[#6a5cff]/40 hover:bg-white/10 group animate-fade-in-up cursor-pointer"
                style={{animationDelay: `${0.1 * index}s`}}
                onClick={(e) => {
                  // Only navigate if the click wasn't on a button or link
                  const target = e.target as HTMLElement;
                  if (!target.closest('a') && !target.closest('button')) {
                    router.push(getProjectUrl(project));
                  }
                }}
              >
                {/* Card Header with Icon - Fixed Height */}
                <div className="flex items-center gap-2 px-5 pt-5 pb-3 w-full h-[5rem]">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#6a5cff] text-lg font-bold shadow-sm group-hover:bg-[#6a5cff]/30 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75v16.5m-9-16.5v16.5M3.75 7.5h16.5m-16.5 9h16.5" />
                    </svg>
                  </span>
                  <div className="flex-1 h-full flex items-center">
                    <h4 className="font-semibold text-lg text-white tracking-wide hover:text-[#6a5cff] transition-colors duration-200 leading-tight">{project.title}</h4>
                  </div>
                </div>
                {/* Image Section - Fixed Height */}
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
                  
                  {/* Description - Fixed Height */}
                  <div className="h-[4.2rem] mb-3">
                    <p className="text-gray-300 text-sm line-clamp-3">{truncateDescription(project.description)}</p>
                  </div>
                  
                  {/* Technologies - Fixed Height Area */}
                  <div className="min-h-[3rem] mb-4 flex items-start">
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 text-xs rounded hover:bg-[#6a5cff]/30 hover:text-white hover:border-[#6a5cff]/50 transition-all duration-200 cursor-default"
                            style={{animationDelay: `${0.1 * index}s`}}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

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
        </section>

        {/* Contact Section */}
        <section id="contact" className="mt-20 text-center">
          <div className="animate-fade-in-up">
            <h3 className="text-3xl font-black mb-6 text-white tracking-widest uppercase hover:text-[#6a5cff] transition-colors duration-300">Contact</h3>
            <p className="text-gray-300 mb-6 text-lg">Want to connect or collaborate? Send me a message!</p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded border-2 border-[#6a5cff] text-white font-bold bg-[#232842]/40 hover:bg-[#6a5cff]/67 hover:text-white hover:scale-105 transition-all duration-200 text-lg shadow-lg tracking-wide uppercase cursor-pointer"
            >
              Get In Touch
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-black/90 backdrop-blur-sm text-center text-gray-400 text-base border-t-2 border-[#232842]/40 mt-16 relative z-10 rounded-t-xl shadow-lg tracking-widest uppercase">
        <div className="flex flex-col items-center gap-2 animate-fade-in-up">
          <div>&copy; {new Date().getFullYear()} Maud Kusters. All rights reserved.</div>
          <AuthAwareAdminLink />
        </div>
      </footer>
    </div>
  );
}

function HomeNavButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/")}
      className="text-3xl md:text-4xl font-black text-white select-none tracking-widest drop-shadow-lg hover:text-[#6a5cff] hover:scale-105 transition-all duration-200 cursor-pointer"
      style={{ fontFamily: 'var(--font-geist-sans)' }}
      type="button"
      aria-label="Go to home page"
    >
      <span className="block sm:hidden">MK</span>
      <span className="hidden sm:block">M Kusters</span>
    </button>
  );
}

function WorkScrollButton() {
  const router = useRouter();
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    router.push("/work");
  }
  return (
    <button
      onClick={handleClick}
      className="text-white bg-transparent rounded px-5 py-2 font-bold text-lg hover:text-[#6a5cff] hover:bg-[#232842]/30 hover:scale-105 transition-all duration-200 shadow-sm tracking-wide cursor-pointer"
      type="button"
    >
      Work
    </button>
  );
}

function ContactScrollButton() {
  const router = useRouter();
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    router.push("/contact");
  }
  return (
    <button
      onClick={handleClick}
      className="inline-block px-8 py-3 rounded border-2 border-[#6a5cff] text-white font-bold bg-[#232842]/40 hover:bg-[#6a5cff]/50 hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-200 text-lg shadow-lg tracking-wide uppercase cursor-pointer"
      type="button"
    >
      Get in touch
    </button>
  );
}