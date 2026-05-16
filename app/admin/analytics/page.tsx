'use client';

import { useState, useEffect } from 'react';
import { Users, Download, AlertCircle, Globe, Loader2, TrendingUp } from 'lucide-react';

interface Stats {
  total_visits: number;
  total_success: number;
  total_failed: number;
  total_ad_clicks: number;
  top_countries: { country: string; count: number }[];
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/analytics');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin mb-2" />
      <p>Crunching the numbers...</p>
    </div>
  );

  if (!stats) return <div className="text-center py-12">Failed to load analytics.</div>;

  const ctr = stats.total_visits > 0 
    ? ((stats.total_ad_clicks / stats.total_visits) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-black">Analytics Overview</h1>
        <p className="text-gray-500">Track your site growth and ad performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Total Visits</p>
          <h3 className="text-3xl font-bold text-black">{stats.total_visits.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Ad CTR</p>
          <h3 className="text-3xl font-bold text-black">{ctr}%</h3>
          <p className="text-[10px] text-gray-400 mt-1">{stats.total_ad_clicks} total clicks</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 mb-4">
            <Download className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Downloads</p>
          <h3 className="text-3xl font-bold text-black">{stats.total_success.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Failed</p>
          <h3 className="text-3xl font-bold text-black">{stats.total_failed.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Countries */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-black">
            <Globe className="w-5 h-5 text-gray-400" />
            Audience by Country
          </h2>
          <div className="space-y-4">
            {stats.top_countries.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 text-sm font-bold text-gray-400">#{index + 1}</div>
                <div className="flex-grow">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-black">{item.country}</span>
                    <span className="text-sm text-gray-400">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-1000" 
                      style={{ width: `${(item.count / stats.total_visits) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {stats.top_countries.length === 0 && <p className="text-gray-400 text-sm">No data yet.</p>}
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-6">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-black">Conversion Rate</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            Percentage of visitors who successfully downloaded a video.
          </p>
          <div className="text-5xl font-black text-indigo-500">
            {stats.total_visits > 0 
              ? ((stats.total_success / stats.total_visits) * 100).toFixed(1) 
              : 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
