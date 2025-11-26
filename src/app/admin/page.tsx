import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminDashboard from '../../components/AdminDashboard';

export default async function AdminPage() {
  let supabase;
  
  try {
    supabase = await createClient();
  } catch (error) {
    console.error('Supabase configuration error:', error);
    
    // If Supabase is not configured, show setup message
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#181a20] to-[#232842] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#181b23] rounded-2xl border border-[#232842]/40 p-8 shadow-2xl text-center">
          <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-4">
            Setup Required
          </h1>
          <p className="text-gray-300 mb-6">
            Supabase is not configured yet. Please set up your Supabase project and update your environment variables.
          </p>
          <div className="text-left bg-[#232842]/30 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm mb-2">1. Create a Supabase project</p>
            <p className="text-gray-400 text-sm mb-2">2. Update .env.local with your credentials</p>
            <p className="text-gray-400 text-sm">3. Run the database schema</p>
          </div>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#6a5cff] text-white rounded-lg hover:bg-[#6a5cff]/80 transition-colors cursor-pointer"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  // Supabase is configured, check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    redirect('/auth/login');
  }

  return <AdminDashboard user={user} />;
}