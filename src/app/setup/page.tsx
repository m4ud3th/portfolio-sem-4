import Link from 'next/link';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#181a20] to-[#232842] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#181b23] rounded-2xl border border-[#232842]/40 p-8 shadow-2xl">
          <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-6 text-center">
            Supabase Setup Guide
          </h1>
          
          <div className="space-y-8">
            <div className="bg-[#232842]/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">🚀 Step 1: Create Supabase Project</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#6a5cff] hover:text-[#6a5cff]/80 cursor-pointer">supabase.com</a></li>
                <li>Sign up or log in to your account</li>
                <li>Click &quot;New Project&quot;</li>
                <li>Choose your organization and fill in project details</li>
                <li>Wait for the project to be created</li>
              </ol>
            </div>

            <div className="bg-[#232842]/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">🔑 Step 2: Get API Keys</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>In your Supabase dashboard, go to Settings → API</li>
                <li>Copy the &quot;Project URL&quot;</li>
                <li>Copy the &quot;anon public&quot; key</li>
                <li>Copy the &quot;service_role&quot; key (keep this secret!)</li>
              </ol>
            </div>

            <div className="bg-[#232842]/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">⚙️ Step 3: Update Environment Variables</h2>
              <p className="text-gray-300 mb-4">Update your <code className="bg-[#232842]/60 px-2 py-1 rounded">.env.local</code> file with:</p>
              <pre className="bg-black/50 rounded-lg p-4 text-green-400 text-sm overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000`}
              </pre>
            </div>

            <div className="bg-[#232842]/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">🗄️ Step 4: Set Up Database</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>In your Supabase dashboard, go to the SQL Editor</li>
                <li>Create a new query</li>
                <li>Copy the contents of <code className="bg-[#232842]/60 px-2 py-1 rounded">supabase/schema.sql</code> from your project</li>
                <li>Paste and run the query</li>
                <li>This will create the necessary tables and security policies</li>
              </ol>
            </div>

            <div className="bg-[#232842]/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">🎉 Step 5: Test Your Setup</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Restart your development server: <code className="bg-[#232842]/60 px-2 py-1 rounded">npm run dev</code></li>
                <li>Go to <code className="bg-[#232842]/60 px-2 py-1 rounded">/auth/signup</code> to create an account</li>
                <li>Sign in and access the admin dashboard</li>
                <li>Add your first project!</li>
              </ol>
            </div>

            <div className="text-center pt-6">
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-[#6a5cff] text-white rounded-lg hover:bg-[#6a5cff]/80 transition-colors font-bold cursor-pointer"
              >
                Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}