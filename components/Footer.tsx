import { X, Github, Heart } from 'lucide-react';

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
                <Github className="w-5 h-5 text-gray-600" />
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
