'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InfluencerCampaigns() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    // Redirect if not authenticated or not an influencer
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'INFLUENCER') {
      router.push('/dashboard/business');
      return;
    }

    // Fetch campaigns for this influencer
    if (status === 'authenticated' && session?.user?.id) {
      fetchCampaigns();
    }
  }, [status, session, router]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would be a dedicated endpoint
      // For this MVP, we'll simulate it
      const response = await fetch(`/api/users/${session.user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      
      const data = await response.json();
      
      if (data.influencer) {
        // Simulate fetching campaigns for this influencer
        // In a real implementation, this would be a separate API call
        const mockCampaigns = [
          {
            id: '1',
            campaignId: '101',
            campaign: {
              id: '101',
              title: 'Tech Product Launch',
              description: 'Promote our new tech gadget to your audience',
              business: { username: 'TechCorp' },
            },
            brief: 'Create a post showcasing our new smart device in action',
            contentStatus: 'PENDING',
            paymentStatus: 'UNPAID',
            paymentAmount: 200,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            campaignId: '102',
            campaign: {
              id: '102',
              title: 'Fitness App Promotion',
              description: 'Share your experience using our fitness app',
              business: { username: 'FitLife' },
            },
            brief: 'Create a post or story showing your workout with our app',
            contentStatus: 'SUBMITTED',
            paymentStatus: 'UNPAID',
            paymentAmount: 150,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            campaignId: '103',
            campaign: {
              id: '103',
              title: 'Crypto Wallet Feature',
              description: 'Highlight the new features of our crypto wallet',
              business: { username: 'CryptoWallet' },
            },
            brief: 'Create a tutorial showing how to use our new staking feature',
            contentStatus: 'APPROVED',
            paymentStatus: 'PAID',
            paymentAmount: 300,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        
        setCampaigns(mockCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to load campaigns. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCampaigns = filter === 'ALL' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.contentStatus === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'UNPAID':
        return 'bg-gray-100 text-gray-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <h1 className="text-display text-primary mb-lg">Your Campaigns</h1>

      {error && <p className="text-red-500 mb-lg">{error}</p>}

      <div className="mb-md">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'ALL' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'PENDING' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('SUBMITTED')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'SUBMITTED' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Submitted
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'APPROVED' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'REJECTED' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="bg-surface p-md rounded-lg shadow-card text-center py-10">
          <p>No campaigns found.</p>
        </div>
      ) : (
        <div className="space-y-md">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-surface p-md rounded-lg shadow-card">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-body font-bold">
                    <Link href={`/campaigns/${campaign.campaignId}`} className="text-primary hover:underline">
                      {campaign.campaign.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    By {campaign.campaign.business.username} • 
                    Received: {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(campaign.contentStatus)}`}>
                    {campaign.contentStatus}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusClass(campaign.paymentStatus)}`}>
                    {campaign.paymentStatus}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Brief:</h3>
                <p className="text-sm bg-gray-50 p-2 rounded-sm">{campaign.brief}</p>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500">Payment: </span>
                  <span>${campaign.paymentAmount}</span>
                </div>
                
                <div className="flex space-x-2">
                  {campaign.contentStatus === 'PENDING' && (
                    <>
                      <button className="text-sm px-3 py-1 bg-accent text-white rounded-md">
                        Accept
                      </button>
                      <button className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md">
                        Decline
                      </button>
                    </>
                  )}
                  
                  {campaign.contentStatus === 'PENDING' && (
                    <Link 
                      href={`/campaigns/${campaign.campaignId}/submit`} 
                      className="text-sm px-3 py-1 bg-primary text-white rounded-md"
                    >
                      Submit Content
                    </Link>
                  )}
                  
                  {campaign.contentStatus === 'SUBMITTED' && (
                    <span className="text-sm text-blue-500">Awaiting review</span>
                  )}
                  
                  {campaign.contentStatus === 'APPROVED' && campaign.paymentStatus === 'PAID' && (
                    <span className="text-sm text-green-500">Completed</span>
                  )}
                  
                  {campaign.contentStatus === 'APPROVED' && campaign.paymentStatus !== 'PAID' && (
                    <span className="text-sm text-blue-500">Payment pending</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

