'use client';

import Link from 'next/link';

export default function InfluencerCard({ influencer, variant = 'basic', onSelect, selected }) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(influencer.id);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all ${
        selected ? 'ring-2 ring-primary' : ''
      } ${onSelect ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onSelect ? handleClick : undefined}
    >
      <div className="p-4">
        <div className="flex items-center">
          {influencer.image ? (
            <img
              src={influencer.image}
              alt={influencer.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center">
              {influencer.name ? influencer.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{influencer.name}</h3>
            {variant === 'detailed' && influencer.score && (
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Match Score:</span>
                <span className="ml-1 text-sm font-medium text-primary">{(influencer.score * 100).toFixed(0)}%</span>
              </div>
            )}
            {variant === 'basic' && influencer.niche && (
              <p className="text-sm text-gray-500">{Array.isArray(influencer.niche) ? influencer.niche.join(', ') : influencer.niche}</p>
            )}
          </div>
        </div>

        {variant === 'detailed' && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Followers</p>
                <p className="text-sm font-medium">{influencer.followers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Engagement</p>
                <p className="text-sm font-medium">{(influencer.engagement * 100).toFixed(1)}%</p>
              </div>
            </div>

            {influencer.niche && (
              <div>
                <p className="text-xs text-gray-500">Niche</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(Array.isArray(influencer.niche) ? influencer.niche : [influencer.niche]).map((niche) => (
                    <span
                      key={niche}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {niche}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {influencer.authenticity && (
              <div>
                <p className="text-xs text-gray-500">Authenticity Score</p>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${influencer.authenticity * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1">{(influencer.authenticity * 100).toFixed(0)}/100</p>
              </div>
            )}

            {influencer.socialAccounts && influencer.socialAccounts.length > 0 && (
              <div>
                <p className="text-xs text-gray-500">Social Accounts</p>
                <div className="mt-1 space-y-1">
                  {influencer.socialAccounts.map((account) => (
                    <div key={account.platform} className="flex items-center">
                      <span className="text-sm font-medium">{account.platform}:</span>
                      <span className="ml-1 text-sm text-gray-600">{account.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {variant === 'detailed' && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
            <Link
              href={`/influencers/${influencer.id}`}
              className="text-sm text-primary hover:text-accent"
              onClick={(e) => e.stopPropagation()}
            >
              View Full Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

