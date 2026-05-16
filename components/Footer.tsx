import { X, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl tracking-tight">X<span className="text-blue-500">Clips</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The fastest and most reliable way to download videos from X (Twitter) without any accounts or subscriptions.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/" className="hover:text-black transition-colors">Home</a></li>
              <li><a href="/how-it-works" className="hover:text-black transition-colors">How it works</a></li>
              <li><a href="/safety-privacy" className="hover:text-black transition-colors">Safety & Privacy</a></li>
              <li><a href="/terms" className="hover:text-black transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Connect</h4>
            <div className="flex items-center gap-4">
              <a 
                href="https://x.com/0xbabywhale5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 fill-current" />
              </a>
              <a 
                href="https://github.com/babywhale0x/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} XClips. All rights reserved. Not affiliated with X Corp.</p>
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-current" /> for the community
          </div>
        </div>
      </div>
    </footer>
  );
}
