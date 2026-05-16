import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MousePointer2, Settings2, Download } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-gray-900">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-black">How it <span className="text-blue-500">Works</span></h1>
            <p className="text-lg text-gray-500">Getting your favorite content from X has never been easier.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6">
                <MousePointer2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">1. Copy Link</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Find the tweet containing the video you want to save. Copy the URL from your browser or the "Share" menu.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-6">
                <Settings2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">2. Paste & Process</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Paste the link into the XClips search bar and hit Download. Our engine will find the best quality MP4 available.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-6">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">3. Save to Device</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Click the final Save button to download the video directly to your phone, tablet, or computer.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
