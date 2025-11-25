"use client";

import { useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  
  // Check if Supabase is configured
  const isConfigured = isSupabaseConfigured();
  const supabase = isConfigured ? createClient() : null;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('New account registration is disabled.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#181a20] to-[#232842] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#181b23] rounded-2xl border border-[#232842]/40 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-2">
            Sign Up Disabled
          </h1>
          <p className="text-gray-300">New account registration is not available</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-lg text-green-200 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none transition-colors"
              placeholder="Enter your full name"
            />
          </div>

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
              minLength={6}
              className="w-full px-4 py-3 bg-[#232842]/30 border border-[#232842] rounded-lg text-white placeholder-gray-400 focus:border-[#6a5cff] focus:outline-none transition-colors"
              placeholder="Enter your password (min. 6 characters)"
            />
          </div>

          <button
            type="submit"
            disabled={true}
            className="w-full py-3 px-4 bg-gray-600 cursor-not-allowed text-white font-bold rounded-lg transition-colors duration-200 uppercase tracking-wide"
          >
            Sign Up Disabled
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#6a5cff] hover:text-[#6a5cff]/80 transition-colors cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}