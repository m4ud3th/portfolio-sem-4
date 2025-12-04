import AuthAwareAdminLink from '@/components/AuthAwareAdminLink';

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-gradient-to-br from-black/95 via-[#181a20]/90 to-[#232842]/85 backdrop-blur-md text-center text-gray-400 text-base border-t-2 border-[#232842]/40 mt-16 relative z-10 rounded-t-xl shadow-lg tracking-widest uppercase">
      <p>&copy; {new Date().getFullYear()} Maud Kusters. All rights reserved.</p>
      <div className="mt-2">
        <AuthAwareAdminLink />
      </div>
    </footer>
  );
}
