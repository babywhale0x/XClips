import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, EyeOff, Lock } from 'lucide-react';

export default function SafetyPrivacy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-gray-900">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black mb-6 text-black">Safety & <span className="text-blue-500">Privacy</span></h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              Your privacy is our top priority. Here's how we protect you.
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                <EyeOff className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-black">No Tracking</h3>
                <p className="text-gray-500 leading-relaxed">
                  We do not use tracking cookies to identify you. We only collect anonymous visit statistics to improve our service performance.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 flex-shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-black">No Accounts Required</h3>
                <p className="text-gray-500 leading-relaxed">
                  You never need to log in or provide an email address. XClips is an anonymous tool designed for utility, not data collection.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-black">Safe Downloads</h3>
                <p className="text-gray-500 leading-relaxed">
                  All downloads are processed through secure server-side extraction. We never link to malicious external sites or pop-up ads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
