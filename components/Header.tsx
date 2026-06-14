import { X } from 'lucide-react';
import Link from 'next/link';

const VerseLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="verseGrad" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="50%" stopColor="#5E5CFF" />
        <stop offset="100%" stopColor="#D500F9" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#verseGrad)" />
    <line x1="68" y1="32" x2="50" y2="68" stroke="white" strokeOpacity="0.6" strokeWidth="18" strokeLinecap="round" />
    <line x1="32" y1="32" x2="50" y2="68" stroke="white" strokeWidth="18" strokeLinecap="round" />
  </svg>
);

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-black p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <X className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">X<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Clips</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/how-it-works" className="hover:text-black transition-colors">How it works</Link>
          <Link href="/safety-privacy" className="hover:text-black transition-colors">Safety</Link>
          <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-fuchsia-50 px-3 py-1.5 rounded-full border border-fuchsia-100/50 shadow-sm transition-all hover:shadow-md hover:scale-105 cursor-pointer">
            <span className="text-xs text-gray-500 font-medium hidden sm:block">Powered by</span>
            <div className="flex items-center gap-1.5">
              <VerseLogo className="w-5 h-5" />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-fuchsia-500 tracking-tight">verse</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
