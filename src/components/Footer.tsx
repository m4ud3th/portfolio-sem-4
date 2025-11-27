import AuthAwareAdminLink from '@/components/AuthAwareAdminLink';

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-black/90 backdrop-blur-sm text-center text-gray-400 text-base border-t-2 border-[#232842]/40 mt-16 relative z-10 rounded-t-xl shadow-lg tracking-widest uppercase">
      <p>&copy; {new Date().getFullYear()} Maud Kusters. All rights reserved.</p>
      <div className="mt-2">
        <AuthAwareAdminLink />
      </div>
    </footer>
  );
}
