'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnalyticsChart from '@/app/components/AnalyticsChart';

export default function BusinessDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

    // Fetch data
    if (status === 'authenticated') {
      fetchCampaigns();
      fetchAnalytics();
    }
  }, [status, session, router]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`/api/campaigns?businessId=${session.user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to load campaigns. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?businessId=${session.user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Don't set error state here to avoid overriding the campaigns error
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
      <div className="flex justify-between items-center mb-lg">
        <h1 className="text-display text-primary">Business Dashboard</h1>
        <Link 
          href="/campaigns/create" 
          className="bg-accent text-white px-md py-sm rounded-md"
        >
          Create Campaign
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-lg">
          {error}
        </div>
      )}

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
          <div className="bg-surface p-md rounded-lg shadow-card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Reach</h3>
            <p className="text-2xl font-bold">{analytics.summary.totalReach.toLocaleString()}</p>
          </div>
          <div className="bg-surface p-md rounded-lg shadow-card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Engagement</h3>
            <p className="text-2xl font-bold">{analytics.summary.totalEngagement.toLocaleString()}</p>
          </div>
          <div className="bg-surface p-md rounded-lg shadow-card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Spend</h3>
            <p className="text-2xl font-bold">${analytics.summary.totalSpend.toLocaleString()}</p>
          </div>
          <div className="bg-surface p-md rounded-lg shadow-card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Overall ROI</h3>
            <p className="text-2xl font-bold">{analytics.summary.overallROI.toFixed(2)}%</p>
          </div>
        </div>
      )}

      {/* Analytics Chart */}
      {analytics && analytics.campaigns.length > 0 && (
        <div className="mb-lg">
          <AnalyticsChart 
            data={analytics.campaigns.map(campaign => ({
              id: campaign.id,
              title: campaign.title,
              metrics: {
                reach: campaign.reach,
                engagement: campaign.engagement,
              },
            }))} 
            variant="bar" 
          />
        </div>
      )}

      {/* Campaigns */}
      <div className="mb-lg">
        <h2 className="text-body font-bold mb-md">Your Campaigns</h2>
        
        {campaigns.length === 0 ? (
          <div className="bg-surface p-md rounded-lg shadow-card text-center">
            <p className="text-gray-500 mb-4">You don't have any campaigns yet.</p>
            <Link 
              href="/campaigns/create" 
              className="bg-accent text-white px-md py-sm rounded-md inline-block"
            >
              Create Your First Campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-surface rounded-lg shadow-card">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Campaign</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Influencers</th>
                  <th className="text-center py-3 px-4">Budget</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/campaigns/${campaign.id}`} className="text-accent hover:underline">
                        {campaign.title}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        campaign.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                        campaign.status === 'MATCHING' ? 'bg-blue-100 text-blue-800' :
                        campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      {campaign.influencerCampaigns.length}
                    </td>
                    <td className="text-center py-3 px-4">
                      ${campaign.budget}
                    </td>
                    <td className="text-right py-3 px-4">
                      <Link 
                        href={`/campaigns/${campaign.id}`} 
                        className="text-accent hover:underline"
                      >
                        View
                      </Link>
                      {campaign.status === 'DRAFT' && (
                        <>
                          <span className="mx-2 text-gray-300">|</span>
                          <Link 
                            href={`/campaigns/${campaign.id}/edit`} 
                            className="text-accent hover:underline"
                          >
                            Edit
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

