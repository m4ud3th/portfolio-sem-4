import Link from 'next/link';
import Image from 'next/image';

export default function StaticProjectPage() {
  const project = {
    title: '2B Green',
    description: 'A web project I built as part of my first internship. I learned a lot about React, teamwork, and building real-world features. This project taught me valuable skills in frontend development, team collaboration, and working with real client requirements.',
    image_url: '/images/2b-green.png',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    featured: true,
    project_date: 'March 2024',
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              {project.featured && (
                <span className="inline-block px-4 py-2 bg-[#6a5cff] text-white text-sm rounded-full font-bold uppercase tracking-wide">
                  Featured Project
                </span>
              )}
              <span className="inline-block px-4 py-2 bg-[#232842]/60 text-gray-300 text-sm rounded-full font-medium tracking-wide">
                {project.project_date}
              </span>
            </div>
          </div>

          {/* Project Image */}
          <div className="w-full max-w-4xl mx-auto mb-8 rounded-xl overflow-hidden shadow-xl border border-[#232842]/30">
            <Image
              src={project.image_url} 
              alt={`${project.title} preview`} 
              width={1200}
              height={600}
              className="w-full h-auto object-cover" 
            />
          </div>

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

            {/* Additional Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 tracking-wide uppercase">Experience Gained</h2>
              <ul className="text-gray-300 text-lg leading-relaxed space-y-2">
                <li>• Collaborative development in a professional environment</li>
                <li>• Working with TypeScript for better code quality</li>
                <li>• Implementing responsive design with Tailwind CSS</li>
                <li>• Understanding client requirements and delivering solutions</li>
                <li>• Code review processes and team workflow</li>
              </ul>
            </div>

            {/* Note about availability */}
            <div className="text-center pt-8 border-t border-[#232842]/40">
              <p className="text-gray-400 italic">
                This project was developed during my internship. Live demo and source code are not publicly available.
              </p>
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

export async function generateMetadata() {
  return {
    title: '2B Green - Maud Kusters',
    description: 'A web project I built as part of my first internship. I learned a lot about React, teamwork, and building real-world features.',
  };
}