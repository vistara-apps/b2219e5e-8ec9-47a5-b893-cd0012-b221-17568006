'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BusinessAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    // Redirect if not authenticated or not a business
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'BUSINESS') {
      router.push('/dashboard/influencer');
      return;
    }

    // Fetch analytics for this business
    if (status === 'authenticated' && session?.user?.id) {
      fetchAnalytics();
    }
  }, [status, session, router, timeframe]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics?businessId=${session.user.id}&timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-display text-primary mb-lg">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-display text-primary mb-lg">Campaign Analytics</h1>

      {error && <p className="text-red-500 mb-lg">{error}</p>}

      <div className="mb-lg">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              timeframe === 'all' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-full text-sm ${
              timeframe === 'month' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Last Month
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 rounded-full text-sm ${
              timeframe === 'week' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Last Week
          </button>
        </div>
      </div>

      {!analytics ? (
        <div className="bg-surface p-md rounded-lg shadow-card text-center py-10">
          <p>No analytics data available.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
            <div className="bg-surface p-md rounded-lg shadow-card">
              <h3 className="text-sm text-gray-500 mb-sm">Total Reach</h3>
              <p className="text-display">{analytics.summary.totalReach.toLocaleString()}</p>
            </div>
            
            <div className="bg-surface p-md rounded-lg shadow-card">
              <h3 className="text-sm text-gray-500 mb-sm">Total Engagement</h3>
              <p className="text-display">{analytics.summary.totalEngagement.toLocaleString()}</p>
            </div>
            
            <div className="bg-surface p-md rounded-lg shadow-card">
              <h3 className="text-sm text-gray-500 mb-sm">Total Spend</h3>
              <p className="text-display">${analytics.summary.totalSpend.toLocaleString()}</p>
            </div>
            
            <div className="bg-surface p-md rounded-lg shadow-card">
              <h3 className="text-sm text-gray-500 mb-sm">Overall ROI</h3>
              <p className="text-display">{analytics.summary.overallROI.toFixed(2)}%</p>
            </div>
          </div>

          <div className="bg-surface p-md rounded-lg shadow-card mb-lg">
            <h2 className="text-body font-bold mb-md">Campaign Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Campaign</th>
                    <th className="text-right py-2 px-4">Reach</th>
                    <th className="text-right py-2 px-4">Engagement</th>
                    <th className="text-right py-2 px-4">Spend</th>
                    <th className="text-right py-2 px-4">ROI</th>
                    <th className="text-right py-2 px-4">Influencers</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <Link href={`/campaigns/${campaign.id}`} className="text-primary hover:underline">
                          {campaign.title}
                        </Link>
                      </td>
                      <td className="text-right py-2 px-4">{campaign.reach.toLocaleString()}</td>
                      <td className="text-right py-2 px-4">{campaign.engagement.toLocaleString()}</td>
                      <td className="text-right py-2 px-4">${campaign.spend.toLocaleString()}</td>
                      <td className="text-right py-2 px-4">{campaign.roi.toFixed(2)}%</td>
                      <td className="text-right py-2 px-4">{campaign.influencers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface p-md rounded-lg shadow-card">
            <h2 className="text-body font-bold mb-md">Performance Insights</h2>
            <div className="space-y-md">
              <div className="p-sm bg-blue-50 rounded-sm">
                <h3 className="font-medium mb-1">Audience Reach</h3>
                <p className="text-sm">
                  Your campaigns have reached a total of {analytics.summary.totalReach.toLocaleString()} potential users.
                  {analytics.summary.campaignCount > 1 && 
                    ` The campaign with the highest reach is "${analytics.campaigns[0].title}" with ${analytics.campaigns[0].reach.toLocaleString()} potential users.`}
                </p>
              </div>
              
              <div className="p-sm bg-green-50 rounded-sm">
                <h3 className="font-medium mb-1">Engagement Analysis</h3>
                <p className="text-sm">
                  Your overall engagement rate is {((analytics.summary.totalEngagement / analytics.summary.totalReach) * 100).toFixed(2)}%.
                  {analytics.summary.campaignCount > 1 && 
                    ` The campaign with the highest engagement is "${analytics.campaigns.sort((a, b) => b.engagement - a.engagement)[0].title}".`}
                </p>
              </div>
              
              <div className="p-sm bg-purple-50 rounded-sm">
                <h3 className="font-medium mb-1">ROI Optimization</h3>
                <p className="text-sm">
                  Your overall ROI is {analytics.summary.overallROI.toFixed(2)}%.
                  {analytics.summary.campaignCount > 1 && 
                    ` The campaign with the highest ROI is "${analytics.campaigns.sort((a, b) => b.roi - a.roi)[0].title}" at ${analytics.campaigns.sort((a, b) => b.roi - a.roi)[0].roi.toFixed(2)}%.`}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

