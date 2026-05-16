import Link from 'next/link';
import { LayoutDashboard, Megaphone, BarChart3, LogOut, ExternalLink } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-black">X<span className="text-blue-500">Clips</span> Admin</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          <Link href="/admin/ads" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-all">
            <Megaphone className="w-5 h-5" />
            <span className="font-medium">Manage Ads</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-all">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-black transition-all">
            <ExternalLink className="w-5 h-5" />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
