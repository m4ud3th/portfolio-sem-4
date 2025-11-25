"use client";

import { useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Check if Supabase is configured
  const isConfigured = isSupabaseConfigured();
  const supabase = isConfigured ? createClient() : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!supabase) {
      setError('Supabase is not configured. Please set up your environment variables.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#181a20] to-[#232842] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#181b23] rounded-2xl border border-[#232842]/40 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-2">
            {isConfigured ? 'Login' : 'Setup Required'}
          </h1>
          <p className="text-gray-300">
            {isConfigured ? 'Access your portfolio admin panel' : 'Supabase configuration needed'}
          </p>
        </div>

        {!isConfigured ? (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-yellow-200 text-sm">
              <p className="font-medium mb-2">Supabase Not Configured</p>
              <p>To use the admin panel, you need to set up Supabase first.</p>
            </div>
            
            <div className="text-left bg-[#232842]/30 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Setup Steps:</h3>
              <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                <li>Create a Supabase project at <span className="text-[#6a5cff]">supabase.com</span></li>
                <li>Copy your project URL and anon key</li>
                <li>Update your <code className="bg-black/30 px-1 rounded">.env.local</code> file</li>
                <li>Run the database schema</li>
              </ol>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/setup"
                className="w-full py-3 px-4 bg-[#6a5cff] hover:bg-[#6a5cff]/80 text-white font-bold rounded-lg transition-colors duration-200 uppercase tracking-wide text-center cursor-pointer"
              >
                View Setup Guide
              </Link>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm text-center cursor-pointer">
                ← Back to Portfolio
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#6a5cff] hover:bg-[#6a5cff]/80 disabled:bg-[#6a5cff]/50 text-white font-bold rounded-lg transition-colors duration-200 uppercase tracking-wide cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>



            <div className="mt-4 text-center">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">
                ← Back to Portfolio
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}