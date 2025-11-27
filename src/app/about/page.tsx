"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database.types";

type AboutContent = Database['public']['Tables']['about_me']['Row'];

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutContent() {
      try {
        const supabase = createClient();
        if (supabase) {
          const { data } = await supabase
            .from('about_me')
            .select('*')
            .limit(1)
            .single();

          if (data) {
            setContent(data);
          }
        }
      } catch (error) {
        console.log('Using default content', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAboutContent();
  }, []);

  const displayContent = content || {
    intro_text: "Hi! I'm Maud Kusters, a college student passionate about web development and digital design.",
    paragraph_two: "I'm currently studying and building my skills in modern web technologies. I love creating beautiful, functional websites that solve real problems and provide great user experiences.",
    paragraph_three: "When I'm not coding, you can find me exploring new design trends, learning new frameworks, or working on personal projects that challenge me to grow as a developer.",
    skills: ['Git', 'Next.js', 'Node.js', 'React', 'Supabase', 'Tailwind CSS', 'TypeScript']
  };
  return (
    <div className="min-h-screen font-sans flex flex-col bg-black relative overflow-x-hidden">
      {/* Grungy Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-overlay" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/diamond-upholstery.png), url(https://www.transparenttextures.com/patterns/grunge-wall.png)'}} />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#6a5cff]/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-[#6a5cff]/10 rounded-full blur-lg animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-[#232842]/30 rounded-full blur-md animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Reusable Navbar Component */}
      <Navbar />

      {/* About Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-8 py-16 relative z-10">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-widest drop-shadow-xl uppercase text-center hover:text-[#6a5cff] transition-colors duration-300" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            About Me
          </h1>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : (
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                {displayContent.intro_text.includes("Maud Kusters") ? (
                  <>
                    {displayContent.intro_text.split("Maud Kusters")[0]}
                    <span className="text-[#6a5cff] font-semibold">Maud Kusters</span>
                    {displayContent.intro_text.split("Maud Kusters")[1]}
                  </>
                ) : (
                  displayContent.intro_text
                )}
              </p>
              
              <p>{displayContent.paragraph_two}</p>
              
              <p>{displayContent.paragraph_three}</p>

              <div className="pt-6 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4 tracking-wide uppercase">Skills & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {displayContent.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 rounded hover:bg-[#6a5cff]/30 hover:text-white hover:border-[#6a5cff]/50 transition-all duration-200 font-medium"
                  >
                    {skill}
                  </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Link
                href="/work"
                className="flex-1 text-center px-6 py-3 rounded border-2 border-[#6a5cff] text-white font-bold bg-[#232842]/40 hover:bg-[#6a5cff]/50 hover:text-white hover:scale-105 transition-all duration-200 shadow-lg tracking-wide uppercase"
              >
                View My Work
              </Link>
              <Link
                href="/contact"
                className="flex-1 text-center px-6 py-3 rounded border-2 border-white/20 text-white font-bold bg-white/5 hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-200 shadow-lg tracking-wide uppercase"
              >
                Get In Touch
              </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reusable Footer Component */}
      <Footer />
    </div>
  );
}
