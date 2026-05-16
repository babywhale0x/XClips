import { X } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-black p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <X className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight">X<span className="text-blue-500">Clips</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/how-it-works" className="hover:text-black transition-colors">How it works</Link>
          <Link href="/safety-privacy" className="hover:text-black transition-colors">Safety</Link>
          <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
            v1.0.0-mvp
          </div>
        </div>
      </div>
    </header>
  );
}
