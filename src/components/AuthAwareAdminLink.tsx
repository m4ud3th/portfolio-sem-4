"use client";

import { useAuth } from './AuthProvider';
import Link from 'next/link';

export default function AuthAwareAdminLink() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null; // Only show when logged in
  }

  return (
    <Link
      href="/admin"
      className="text-gray-500 hover:text-[#6a5cff] text-xs transition-colors duration-200 cursor-pointer"
    >
      Dashboard
    </Link>
  );
}