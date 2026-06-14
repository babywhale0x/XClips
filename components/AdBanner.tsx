'use client';

import { useState, useEffect } from 'react';

type Banner = {
  $id: string;
  image_url: string;
  link_url: string;
};

export default function AdBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch('/api/banners');
        if (res.ok) {
          const data = await res.json();
          setBanners(data);
        }
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-8 flex flex-col items-center justify-center text-center h-[120px] animate-pulse">
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    // Fallback to placeholder if no ads
    return (
      <div className="w-full max-w-4xl mx-auto my-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 to-fuchsia-50 border border-fuchsia-100 p-8 flex flex-col items-center justify-center text-center">
          <div className="absolute top-2 right-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Sponsored
          </div>
          <h3 className="text-gray-900 font-semibold mb-2">Advertise Here</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            Reach thousands of users looking to save their favorite content.
          </p>
          <button className="mt-4 px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-gray-300 transition-colors shadow-sm">
            Contact Us
          </button>
        </div>
      </div>
    );
  }

  // Display the active banner
  const banner = banners[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      <a 
        href={banner.link_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
        onClick={() => {
          // Track ad click
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              event_type: 'ad_click',
              metadata: { ad_id: banner.$id, link: banner.link_url }
            }),
          }).catch(console.error);
        }}
      >
        <div className="absolute top-2 right-2 text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded uppercase tracking-widest z-10 pointer-events-none backdrop-blur-sm">
          Sponsored
        </div>
        {/* Using standard img to support external Appwrite URLs easily */}
        <img 
          src={banner.image_url} 
          alt="Advertisement" 
          className="w-full h-auto max-h-[400px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
        />
      </a>
    </div>
  );
}
