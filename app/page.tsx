'use client';

import { useState, useEffect } from 'react';
import { Download, Link as LinkIcon, Loader2, AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<{ title: string; downloadUrl: string; filename: string } | null>(null);

  // Track visits
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'visit' }),
    }).catch(console.error);
  }, []);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setVideoData(null);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Track failure
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            event_type: 'download_failed',
            metadata: { error: data.error || 'Unknown error', url }
          }),
        }).catch(console.error);
        
        throw new Error(data.error || 'Something went wrong');
      }

      // Track success
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          event_type: 'download_success',
          metadata: { title: data.title, url }
        }),
      }).catch(console.error);

      setVideoData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex-grow pt-32 pb-16 px-4">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent leading-tight">
            Save any video from X <br className="hidden md:block" />
            <span className="text-blue-500 underline decoration-blue-200 decoration-8 underline-offset-4">in seconds.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            High-quality MP4 downloads. No login required. 100% free and open source.
          </p>
        </section>

        {/* Ad Banner */}
        <AdBanner />

        {/* Input Section */}
        <section className="max-w-3xl mx-auto mb-16">
          <div className="bg-white p-2 md:p-3 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-8 transform transition-all hover:shadow-2xl hover:shadow-gray-200/60">
            <form onSubmit={handleDownload} className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-grow group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Paste tweet URL here (e.g., https://x.com/user/status/...)"
                  className="w-full pl-12 pr-4 py-4 md:py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-800 placeholder:text-gray-400"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url}
                className="bg-black text-white px-8 py-4 md:py-2 rounded-2xl font-bold hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Success State */}
          {videoData && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-white border border-green-100 rounded-3xl p-8 shadow-lg shadow-green-50/50 flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate max-w-md">
                  {videoData.title || 'Video Ready'}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Successfully extracted best quality MP4.
                </p>
                <a
                  href={videoData.downloadUrl}
                  download={videoData.filename}
                  className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
                >
                  <Download className="w-5 h-5" />
                  Save MP4
                </a>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="animate-in shake duration-300 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-blue-100 transition-colors group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-6 h-6 rotate-45" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Lightning Fast</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Optimized extraction engine that grabs the best quality in milliseconds.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-blue-100 transition-colors group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">No Accounts</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Simply paste the link and download. We don't ask for any personal data.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-blue-100 transition-colors group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
              <X className="w-6 h-6 fill-current" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">X-Ready</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Specifically tuned for the latest X.com and Twitter.com URL structures.
            </p>
          </div>
        </section>

        {/* Advertisements */}
        <div className="flex flex-col items-center gap-8 mb-12">
          <a href="https://www.effectivecpmnetwork.com/pcrs5ccn?key=fc25e99f461208a6c6d81c5238edec73" target="_blank" rel="noopener noreferrer" className="opacity-0 w-0 h-0 absolute overflow-hidden">Visit our Sponsor</a>
          
          <script async data-cfasync="false" src="https://pl29636612.effectivecpmnetwork.com/7519d9910342ab72722fb9e706ee4f18/invoke.js"></script>
          <div id="container-7519d9910342ab72722fb9e706ee4f18"></div>

          <script dangerouslySetInnerHTML={{ __html: `
            atOptions = {
              'key' : '74c828fd12add3dcc515b4ccc375adab',
              'format' : 'iframe',
              'height' : 60,
              'width' : 468,
              'params' : {}
            };
          `}} />
        </div>
      </main>

      <Footer />

      {/* Background Ornaments */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
      </div>
    </div>
  );
}
