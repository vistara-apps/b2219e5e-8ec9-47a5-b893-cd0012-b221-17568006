'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignStatus({ campaign, isOwner }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const updateCampaignStatus = async (newStatus) => {
    try {
      setIsUpdating(true);
      setError('');
      
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update campaign status');
      }
      
      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      console.error('Error updating campaign status:', error);
      setError(error.message || 'Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
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

  const getStatusDescription = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'Your campaign is in draft mode. Finalize details and launch when ready.';
      case 'MATCHING':
        return 'AI is matching your campaign with relevant influencers.';
      case 'ACTIVE':
        return 'Your campaign is active. Influencers are creating content.';
      case 'COMPLETED':
        return 'Your campaign has been completed successfully.';
      case 'CANCELLED':
        return 'This campaign has been cancelled.';
      default:
        return '';
    }
  };

  return (
    <div className="bg-surface p-md rounded-lg shadow-card mb-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center mb-2">
            <h2 className="text-body font-bold mr-3">Campaign Status</h2>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
              {campaign.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">{getStatusDescription(campaign.status)}</p>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        
        {isOwner && (
          <div className="mt-4 md:mt-0">
            {campaign.status === 'DRAFT' && (
              <button
                onClick={() => updateCampaignStatus('MATCHING')}
                disabled={isUpdating}
                className="bg-accent text-white px-md py-sm rounded-md"
              >
                {isUpdating ? 'Launching...' : 'Launch Campaign'}
              </button>
            )}
            
            {campaign.status === 'MATCHING' && (
              <button
                onClick={() => updateCampaignStatus('ACTIVE')}
                disabled={isUpdating}
                className="bg-accent text-white px-md py-sm rounded-md"
              >
                {isUpdating ? 'Activating...' : 'Activate Campaign'}
              </button>
            )}
            
            {campaign.status === 'ACTIVE' && (
              <button
                onClick={() => updateCampaignStatus('COMPLETED')}
                disabled={isUpdating}
                className="bg-accent text-white px-md py-sm rounded-md"
              >
                {isUpdating ? 'Completing...' : 'Complete Campaign'}
              </button>
            )}
            
            {(campaign.status === 'DRAFT' || campaign.status === 'MATCHING' || campaign.status === 'ACTIVE') && (
              <button
                onClick={() => updateCampaignStatus('CANCELLED')}
                disabled={isUpdating}
                className="bg-gray-100 text-gray-800 px-md py-sm rounded-md ml-2"
              >
                {isUpdating ? 'Cancelling...' : 'Cancel Campaign'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

