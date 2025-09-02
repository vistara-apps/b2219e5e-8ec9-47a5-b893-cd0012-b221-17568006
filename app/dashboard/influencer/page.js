'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InfluencerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [influencerProfile, setInfluencerProfile] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

    // Fetch data
    if (status === 'authenticated' && session?.user?.influencer) {
      fetchInfluencerProfile();
      fetchCampaigns();
    }
  }, [status, session, router]);

  const fetchInfluencerProfile = async () => {
    try {
      const response = await fetch(`/api/users/${session.user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      setInfluencerProfile(data.influencer);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`/api/influencers/${session.user.influencer.id}/campaigns`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Don't set error state here to avoid overriding the profile error
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
      <h1 className="text-display text-primary mb-lg">Influencer Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-lg">
          {error}
        </div>
      )}

      {/* Profile Summary */}
      {influencerProfile && (
        <div className="bg-surface p-md rounded-lg shadow-card mb-lg">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">{session.user.username}</h2>
              <p className="text-gray-500 mb-4">{influencerProfile.platform} Influencer</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Followers</h3>
                  <p className="text-lg">{influencerProfile.followers.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Engagement Rate</h3>
                  <p className="text-lg">{(influencerProfile.engagementRate * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Niche</h3>
                  <p className="text-lg">{influencerProfile.niche}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Authenticity Score</h3>
                  <div className="flex items-center">
                    <div className="bg-gray-200 h-2 w-24 rounded-full overflow-hidden mr-2">
                      <div 
                        className="bg-accent h-full" 
                        style={{ width: `${influencerProfile.authenticityScore}%` }}
                      ></div>
                    </div>
                    <span>{influencerProfile.authenticityScore}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link 
                href="/profile/edit" 
                className="bg-gray-100 text-gray-800 px-md py-sm rounded-md inline-block"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns */}
      <div className="mb-lg">
        <h2 className="text-body font-bold mb-md">Your Campaigns</h2>
        
        {campaigns.length === 0 ? (
          <div className="bg-surface p-md rounded-lg shadow-card text-center">
            <p className="text-gray-500">You don't have any campaigns yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-md">
            {campaigns.map((influencerCampaign) => (
              <div key={influencerCampaign.id} className="bg-surface p-md rounded-lg shadow-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold mb-1">
                      <Link href={`/campaigns/${influencerCampaign.campaign.id}`} className="text-accent hover:underline">
                        {influencerCampaign.campaign.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {influencerCampaign.campaign.business.username}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      influencerCampaign.contentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      influencerCampaign.contentStatus === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                      influencerCampaign.contentStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {influencerCampaign.contentStatus}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      influencerCampaign.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                      influencerCampaign.paymentStatus === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                      influencerCampaign.paymentStatus === 'UNPAID' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {influencerCampaign.paymentStatus}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Brief</h4>
                  <p className="text-sm mb-4">{influencerCampaign.brief}</p>
                  
                  {influencerCampaign.contentStatus === 'PENDING' && (
                    <Link 
                      href={`/campaigns/${influencerCampaign.campaign.id}`} 
                      className="bg-accent text-white px-md py-sm rounded-md inline-block"
                    >
                      Submit Content
                    </Link>
                  )}
                  
                  {influencerCampaign.contentStatus === 'SUBMITTED' && (
                    <p className="text-sm text-blue-600">Content under review</p>
                  )}
                  
                  {influencerCampaign.contentStatus === 'APPROVED' && (
                    <p className="text-sm text-green-600">Content approved!</p>
                  )}
                  
                  {influencerCampaign.contentStatus === 'REJECTED' && (
                    <div>
                      <p className="text-sm text-red-600 mb-2">Content rejected</p>
                      {influencerCampaign.feedbackNotes && (
                        <div className="bg-red-50 p-2 rounded text-sm">
                          <span className="font-medium">Feedback:</span> {influencerCampaign.feedbackNotes}
                        </div>
                      )}
                      <Link 
                        href={`/campaigns/${influencerCampaign.campaign.id}`} 
                        className="bg-accent text-white px-md py-sm rounded-md inline-block mt-2"
                      >
                        Resubmit Content
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

