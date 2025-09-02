'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CampaignStatus from '@/app/components/Campaign/CampaignStatus';
import InfluencerCard from '@/app/components/InfluencerCard';
import ContentSubmission from '@/app/components/Campaign/ContentSubmission';

export default function CampaignDetail({ params }) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [matchedInfluencers, setMatchedInfluencers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [influencerCampaign, setInfluencerCampaign] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Fetch campaign details
    if (status === 'authenticated') {
      fetchCampaign();
    }
  }, [status, id, router]);

  const fetchCampaign = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/campaigns/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }
      
      const data = await response.json();
      setCampaign(data);
      
      // Check if user is the campaign owner
      setIsOwner(session?.user?.id === data.businessId);
      
      // Check if user is an influencer for this campaign
      if (session?.user?.role === 'INFLUENCER' && session?.user?.influencer) {
        const influencerCampaign = data.influencerCampaigns?.find(
          ic => ic.influencer.userId === session.user.id
        );
        
        if (influencerCampaign) {
          setIsInfluencer(true);
          setInfluencerCampaign(influencerCampaign);
        }
      }
      
      // If campaign is in MATCHING status and user is owner, fetch matched influencers
      if (data.status === 'MATCHING' && session?.user?.id === data.businessId) {
        fetchMatchedInfluencers();
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      setError('Failed to load campaign. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMatchedInfluencers = async () => {
    try {
      const response = await fetch(`/api/matching?campaignId=${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch matched influencers');
      }
      
      const data = await response.json();
      setMatchedInfluencers(data.matches || []);
    } catch (error) {
      console.error('Error fetching matched influencers:', error);
      // Don't set error state here to avoid overriding the main campaign error
    }
  };

  const assignInfluencer = async (influencerId) => {
    try {
      const response = await fetch(`/api/matching/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: id,
          influencerIds: [influencerId],
          brief: campaign.description,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign influencer');
      }
      
      // Refresh the campaign data
      fetchCampaign();
    } catch (error) {
      console.error('Error assigning influencer:', error);
      setError('Failed to assign influencer. Please try again.');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-display text-primary mb-lg">Loading...</h1>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-display text-primary mb-lg">Campaign Details</h1>
        <div className="bg-surface p-md rounded-lg shadow-card">
          <p className="text-red-500">{error || 'Campaign not found'}</p>
          <Link href="/dashboard" className="text-accent mt-4 block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-lg">
        <div>
          <h1 className="text-display text-primary">{campaign.title}</h1>
          <p className="text-sm text-gray-500">
            Created: {new Date(campaign.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {isOwner && campaign.status === 'DRAFT' && (
          <Link 
            href={`/campaigns/${id}/edit`} 
            className="bg-accent text-white px-md py-sm rounded-md"
          >
            Edit Campaign
          </Link>
        )}
      </div>

      <CampaignStatus campaign={campaign} isOwner={isOwner} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        <div className="md:col-span-2 bg-surface p-md rounded-lg shadow-card">
          <h2 className="text-body font-bold mb-md">Campaign Details</h2>
          <div className="space-y-md">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
              <p className="text-sm">{campaign.description}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Goals</h3>
              <p className="text-sm">{campaign.goals}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Target Audience</h3>
              <p className="text-sm">{campaign.targetAudience}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Budget</h3>
                <p className="text-sm">${campaign.budget}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Duration</h3>
                <p className="text-sm">
                  {campaign.startDate && campaign.endDate 
                    ? `${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`
                    : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h2 className="text-body font-bold mb-md">Campaign Stats</h2>
          <div className="space-y-md">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
              <p className="text-sm">{campaign.status}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Influencers</h3>
              <p className="text-sm">{campaign.influencerCampaigns?.length || 0}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Content Submissions</h3>
              <p className="text-sm">
                {campaign.influencerCampaigns?.filter(ic => ic.contentStatus === 'SUBMITTED' || ic.contentStatus === 'APPROVED').length || 0}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Approved Content</h3>
              <p className="text-sm">
                {campaign.influencerCampaigns?.filter(ic => ic.contentStatus === 'APPROVED').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Matched Influencers Section (for business owner in MATCHING status) */}
      {isOwner && campaign.status === 'MATCHING' && (
        <div className="bg-surface p-md rounded-lg shadow-card mb-lg">
          <h2 className="text-body font-bold mb-md">Matched Influencers</h2>
          
          {matchedInfluencers.length === 0 ? (
            <p className="text-sm">No influencers matched yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {matchedInfluencers.map(({ influencer, matchScore }) => (
                <div key={influencer.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{influencer.user.username}</h3>
                      <p className="text-sm text-gray-500">
                        {influencer.platform} • {influencer.followers.toLocaleString()} followers
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Niche:</span> {influencer.niche}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Engagement:</span> {(influencer.engagementRate * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{matchScore}%</div>
                      <div className="text-xs text-gray-500">Match</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => assignInfluencer(influencer.id)}
                    className="mt-4 w-full bg-accent text-white px-sm py-sm rounded-sm text-sm"
                  >
                    Assign to Campaign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assigned Influencers Section (for business owner) */}
      {isOwner && campaign.influencerCampaigns && campaign.influencerCampaigns.length > 0 && (
        <div className="bg-surface p-md rounded-lg shadow-card mb-lg">
          <h2 className="text-body font-bold mb-md">Assigned Influencers</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Influencer</th>
                  <th className="text-left py-2 px-4">Platform</th>
                  <th className="text-center py-2 px-4">Followers</th>
                  <th className="text-center py-2 px-4">Content Status</th>
                  <th className="text-center py-2 px-4">Payment Status</th>
                  <th className="text-right py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaign.influencerCampaigns.map((ic) => (
                  <tr key={ic.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{ic.influencer.user.username}</td>
                    <td className="py-2 px-4">{ic.influencer.platform}</td>
                    <td className="text-center py-2 px-4">{ic.influencer.followers.toLocaleString()}</td>
                    <td className="text-center py-2 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ic.contentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        ic.contentStatus === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                        ic.contentStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {ic.contentStatus}
                      </span>
                    </td>
                    <td className="text-center py-2 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ic.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                        ic.paymentStatus === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        ic.paymentStatus === 'UNPAID' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {ic.paymentStatus}
                      </span>
                    </td>
                    <td className="text-right py-2 px-4">
                      {ic.contentStatus === 'SUBMITTED' && (
                        <button className="text-xs px-2 py-1 bg-blue-500 text-white rounded-sm">
                          Review
                        </button>
                      )}
                      {ic.contentStatus === 'APPROVED' && ic.paymentStatus === 'UNPAID' && (
                        <button className="text-xs px-2 py-1 bg-green-500 text-white rounded-sm">
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Influencer View - Content Submission */}
      {isInfluencer && influencerCampaign && (
        <div className="mb-lg">
          <ContentSubmission 
            campaignId={campaign.id}
            influencerId={influencerCampaign.influencer.id}
            currentStatus={influencerCampaign.contentStatus}
          />
        </div>
      )}
    </div>
  );
}

