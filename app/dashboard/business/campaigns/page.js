'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BusinessCampaigns() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

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

    // Fetch campaigns for this business
    if (status === 'authenticated' && session?.user?.id) {
      fetchCampaigns();
    }
  }, [status, session, router]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
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

  const filteredCampaigns = filter === 'ALL' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.status === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'MATCHING':
        return 'bg-blue-100 text-blue-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
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
      <div className="flex justify-between items-center mb-lg">
        <h1 className="text-display text-primary">Your Campaigns</h1>
        <Link href="/campaigns/create" className="bg-accent text-white px-md py-sm rounded-md">
          Create Campaign
        </Link>
      </div>

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
            onClick={() => setFilter('DRAFT')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'DRAFT' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Draft
          </button>
          <button
            onClick={() => setFilter('MATCHING')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'MATCHING' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Matching
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'ACTIVE' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'COMPLETED' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="bg-surface p-md rounded-lg shadow-card text-center py-10">
          <p className="mb-4">No campaigns found.</p>
          <Link href="/campaigns/create" className="text-accent">
            Create your first campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-md">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-surface p-md rounded-lg shadow-card">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-body font-bold">
                    <Link href={`/campaigns/${campaign.id}`} className="text-primary hover:underline">
                      {campaign.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Created: {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                  <p className="line-clamp-2 text-sm mb-2">{campaign.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500">Influencers: </span>
                  <span>{campaign.influencerCampaigns?.length || 0}</span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-500">Budget: </span>
                  <span>${campaign.budget}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Link 
                    href={`/campaigns/${campaign.id}`} 
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    View
                  </Link>
                  {campaign.status === 'DRAFT' && (
                    <Link 
                      href={`/campaigns/${campaign.id}/edit`} 
                      className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      Edit
                    </Link>
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

