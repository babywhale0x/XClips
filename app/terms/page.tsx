import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-gray-900">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
          <h1 className="text-3xl font-black mb-8 text-black border-b border-gray-100 pb-6">Terms of Service</h1>
          
          <div className="prose prose-blue max-w-none text-gray-500 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-black mb-3">1. Acceptance of Terms</h2>
              <p>By using XClips, you agree to comply with these terms. If you do not agree, please do not use the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">2. Permitted Use</h2>
              <p>XClips is provided for personal, non-commercial use. You may use this tool to download content for which you have the legal right to save or content that is in the public domain.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">3. Copyright & Intellectual Property</h2>
              <p>We respect the intellectual property of others. XClips does not host any user content on its servers permanently. Users are solely responsible for ensuring they have permission to download the videos they process.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">4. Disclaimer of Warranty</h2>
              <p>This service is provided "as is" without any warranties of any kind. We are not responsible for any issues arising from the use of downloaded content.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">5. Affiliation</h2>
              <p>XClips is an independent tool and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with X Corp (Twitter).</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
