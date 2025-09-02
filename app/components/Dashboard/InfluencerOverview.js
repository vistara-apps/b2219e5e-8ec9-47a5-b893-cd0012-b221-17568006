'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function InfluencerOverview({ influencerProfile }) {
  const { data: session } = useSession();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (influencerProfile?.id) {
      fetchCampaigns();
    }
  }, [influencerProfile]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/influencers/${influencerProfile.id}/campaigns`);
      
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

  // Calculate summary metrics
  const pendingBriefs = campaigns.filter(c => c.contentStatus === 'PENDING').length;
  const activeCampaigns = campaigns.filter(c => c.contentStatus === 'APPROVED' || c.contentStatus === 'SUBMITTED').length;
  const totalEarnings = campaigns.reduce(
    (sum, campaign) => sum + (campaign.paymentStatus === 'PAID' ? campaign.paymentAmount : 0), 
    0
  );

  return (
    <div>
      <div className="bg-surface p-md rounded-lg shadow-card mb-lg">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-body font-bold">{session?.user?.username || 'Influencer'}</h2>
            <p className="text-sm text-gray-500 mb-2">
              {influencerProfile?.platform || 'Farcaster'} • {influencerProfile?.followers?.toLocaleString() || '0'} followers
            </p>
            <div className="flex items-center mb-2">
              <span className="text-sm mr-2">Authenticity Score:</span>
              <div className="bg-gray-200 h-2 w-24 rounded-full overflow-hidden">
                <div 
                  className="bg-accent h-full" 
                  style={{ width: `${influencerProfile?.authenticityScore || 0}%` }}
                ></div>
              </div>
              <span className="text-sm ml-2">{influencerProfile?.authenticityScore || 0}%</span>
            </div>
            <p className="text-sm">
              <span className="text-gray-500">Niche:</span> {influencerProfile?.niche || 'Not specified'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              href="/dashboard/influencer/profile" 
              className="text-accent hover:underline"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h3 className="text-sm text-gray-500 mb-sm">Pending Briefs</h3>
          <p className="text-display">{pendingBriefs}</p>
          <Link href="/dashboard/influencer/campaigns" className="text-sm text-accent">
            View briefs
          </Link>
        </div>
        
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h3 className="text-sm text-gray-500 mb-sm">Active Campaigns</h3>
          <p className="text-display">{activeCampaigns}</p>
          <Link href="/dashboard/influencer/campaigns" className="text-sm text-accent">
            View campaigns
          </Link>
        </div>
        
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h3 className="text-sm text-gray-500 mb-sm">Total Earnings</h3>
          <p className="text-display">${totalEarnings.toFixed(2)}</p>
          <Link href="/dashboard/influencer/earnings" className="text-sm text-accent">
            View earnings
          </Link>
        </div>
      </div>

      <div className="bg-surface p-md rounded-lg shadow-card">
        <h2 className="text-body font-bold mb-md">Recent Activity</h2>
        {isLoading ? (
          <p>Loading campaigns...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : campaigns.length === 0 ? (
          <p>No campaign activity yet.</p>
        ) : (
          <div className="space-y-sm">
            {campaigns.slice(0, 5).map((campaign) => (
              <div key={campaign.id} className="border-b pb-sm">
                <div className="flex justify-between">
                  <p className="font-medium">{campaign.campaign.title}</p>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {campaign.contentStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {campaign.contentStatus === 'PENDING' ? 'Brief received' : 
                   campaign.contentStatus === 'SUBMITTED' ? 'Content submitted' :
                   campaign.contentStatus === 'APPROVED' ? 'Content approved' : 'Content rejected'}
                  {' • '}
                  {new Date(campaign.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

