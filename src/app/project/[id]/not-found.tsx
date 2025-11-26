import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#181a20] to-[#232842] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#181b23] rounded-2xl border border-[#232842]/40 p-8 shadow-2xl text-center">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-4">
          Project Not Found
        </h1>
        <p className="text-gray-300 mb-6">
          The project you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#6a5cff] text-white rounded-lg hover:bg-[#6a5cff]/80 transition-colors font-bold tracking-wide uppercase cursor-pointer"
        >
          Back to Portfolio
        </Link>
      </div>
    </div>
  );
}