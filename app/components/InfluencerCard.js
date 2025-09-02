'use client';

import Link from 'next/link';

export default function InfluencerCard({ influencer, variant = 'basic' }) {
  const {
    id,
    name,
    followers,
    engagement,
    niche,
    score,
    verified,
  } = influencer;

  // Format followers count
  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      return count.toString();
    }
  };

  // Format engagement rate
  const formatEngagement = (rate) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  if (variant === 'basic') {
    return (
      <div className="bg-surface p-md rounded-lg shadow-card">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-body font-medium">{name}</h3>
            <p className="text-sm text-gray-500">{niche}</p>
          </div>
          {verified && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Verified
            </span>
          )}
        </div>
        
        <div className="mt-2 flex justify-between text-sm">
          <span>{formatFollowers(followers)} followers</span>
          <span>{formatEngagement(engagement)} engagement</span>
        </div>
        
        <Link 
          href={`/influencers/${id}`} 
          className="mt-4 block text-center text-accent hover:underline"
        >
          View Profile
        </Link>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="bg-surface p-md rounded-lg shadow-card">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-body font-medium">{name}</h3>
            <p className="text-sm text-gray-500">{niche}</p>
          </div>
          {verified && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Verified
            </span>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Followers:</span>
            <span className="font-medium">{formatFollowers(followers)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Engagement:</span>
            <span className="font-medium">{formatEngagement(engagement)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Authenticity Score:</span>
            <div className="flex items-center">
              <div className="bg-gray-200 h-2 w-16 rounded-full overflow-hidden mr-2">
                <div 
                  className="bg-accent h-full" 
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              <span className="font-medium">{score}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Link 
            href={`/influencers/${id}`} 
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 py-sm rounded-sm text-sm"
          >
            View Profile
          </Link>
          <button 
            className="flex-1 bg-accent text-white py-sm rounded-sm text-sm"
          >
            Invite
          </button>
        </div>
      </div>
    );
  }

  return null;
}

