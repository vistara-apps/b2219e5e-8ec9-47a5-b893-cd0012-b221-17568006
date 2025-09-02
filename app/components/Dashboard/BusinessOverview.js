'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AnalyticsChart from '../AnalyticsChart';

export default function BusinessOverview({ campaigns }) {
  const { data: session } = useSession();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user?.id) {
      fetchAnalytics();
    }
  }, [session]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics?businessId=${session.user.id}`);
      
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

  // Calculate summary metrics
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
  const totalCampaigns = campaigns.length;
  const totalInfluencers = campaigns.reduce(
    (sum, campaign) => sum + (campaign.influencerCampaigns?.length || 0), 
    0
  );

  // Prepare data for the analytics chart
  const chartData = campaigns.map(campaign => ({
    id: campaign.id,
    title: campaign.title,
    metrics: {
      reach: Math.floor(Math.random() * 50000), // Mock data for MVP
      engagement: Math.floor(Math.random() * 5000), // Mock data for MVP
    }
  }));

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h3 className="text-sm text-gray-500 mb-sm">Active Campaigns</h3>
          <p className="text-display">{activeCampaigns}</p>
          <p className="text-sm text-gray-500">of {totalCampaigns} total</p>
        </div>
        
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h3 className="text-sm text-gray-500 mb-sm">Influencers Engaged</h3>
          <p className="text-display">{totalInfluencers}</p>
          <p className="text-sm text-gray-500">across all campaigns</p>
        </div>
        
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h3 className="text-sm text-gray-500 mb-sm">Total Reach</h3>
          <p className="text-display">
            {analytics ? analytics.summary.totalReach.toLocaleString() : '—'}
          </p>
          <p className="text-sm text-gray-500">potential audience</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-surface p-md rounded-lg shadow-card h-40 flex items-center justify-center">
          <p>Loading analytics...</p>
        </div>
      ) : error ? (
        <div className="bg-surface p-md rounded-lg shadow-card">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <AnalyticsChart data={chartData} variant="bar" />
      )}
    </div>
  );
}

