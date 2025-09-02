    'use client';

    export default function InfluencerCard({ influencer, variant }) {
      return (
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h3 className="text-body font-bold">{influencer.name}</h3>
          {variant === 'detailed' && (
            <>
              <p className="text-body">Followers: {influencer.followers}</p>
              <p className="text-body">Engagement: {(influencer.engagement * 100).toFixed(1)}%</p>
              <p className="text-body">Niche: {influencer.niche}</p>
              <p className="text-body">Authenticity Score: {influencer.score}/100</p>
            </>
          )}
        </div>
      );
    }
  