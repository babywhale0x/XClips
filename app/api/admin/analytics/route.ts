import { NextResponse } from 'next/server';
import { createAdminClient, APPWRITE_DB_ID, ANALYTICS_COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'node-appwrite';

export async function GET() {
  const { databases } = createAdminClient();

  try {
    // Appwrite doesn't have a direct "count only" RPC like Supabase, 
    // so we fetch with limit 1 to get the 'total' count property.
    const [visits, success, failed, adClicks, allVisits] = await Promise.all([
      databases.listDocuments(APPWRITE_DB_ID, ANALYTICS_COLLECTION_ID, [Query.equal('event_type', 'visit'), Query.limit(1)]),
      databases.listDocuments(APPWRITE_DB_ID, ANALYTICS_COLLECTION_ID, [Query.equal('event_type', 'download_success'), Query.limit(1)]),
      databases.listDocuments(APPWRITE_DB_ID, ANALYTICS_COLLECTION_ID, [Query.equal('event_type', 'download_failed'), Query.limit(1)]),
      databases.listDocuments(APPWRITE_DB_ID, ANALYTICS_COLLECTION_ID, [Query.equal('event_type', 'ad_click'), Query.limit(1)]),
      databases.listDocuments(APPWRITE_DB_ID, ANALYTICS_COLLECTION_ID, [Query.equal('event_type', 'visit'), Query.limit(1000)]) // For country aggregation
    ]);

    const countryCounts: Record<string, number> = {};
    allVisits.documents.forEach(doc => {
      const country = doc.country255 || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      total_visits: visits.total,
      total_success: success.total,
      total_failed: failed.total,
      total_ad_clicks: adClicks.total,
      top_countries: topCountries
    });
  } catch (error: any) {
    console.error('Appwrite Admin Analytics error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
