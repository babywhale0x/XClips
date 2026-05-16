'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface Ad {
  $id: string;
  image_url: string;
  link_url: string;
}

export default function AdBanner() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAds() {
      try {
        const res = await fetch('/api/ads');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAds(data);
        }
      } catch (err) {
        console.error('Failed to fetch ads:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 2000); // 2 second slideshow

    return () => clearInterval(interval);
  }, [ads]);

  const handleAdClick = (adId: string) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        event_type: 'ad_click',
        metadata: { adId }
      }),
    }).catch(console.error);
  };

  if (loading || ads.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-in fade-in duration-700">
      <div className="relative group overflow-hidden rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 aspect-[21/9] md:aspect-[3/1]">
        {ads.map((ad, index) => (
          <a
            key={ad.$id}
            href={ad.link_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleAdClick(ad.$id)}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
            }`}
          >
            <img
              src={ad.image_url}
              alt="Sponsored Content"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              Sponsored
            </div>
          </a>
        ))}
        
        {/* Progress Dots */}
        {ads.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {ads.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
