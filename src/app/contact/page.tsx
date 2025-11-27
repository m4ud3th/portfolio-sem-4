'use client';

import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col bg-black relative overflow-x-hidden">
      {/* Grungy Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-15 mix-blend-overlay" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/diamond-upholstery.png), url(https://www.transparenttextures.com/patterns/grunge-wall.png)'}} />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#6a5cff]/15 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-32 h-32 bg-[#6a5cff]/20 rounded-full blur-lg animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-28 h-28 bg-[#232842]/40 rounded-full blur-md animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/6 right-1/3 w-24 h-24 bg-[#6a5cff]/12 rounded-full blur-lg animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
      </div>
      
      {/* Reusable Navbar Component */}
      <Navbar />

      {/* Contact Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-4 py-10 relative z-10">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-widest uppercase">
              Get In Touch
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? I&apos;d love to hear from you! 
              Send me a message and I&apos;ll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </main>

      {/* Reusable Footer Component */}
      <Footer />
    </div>
  );
}