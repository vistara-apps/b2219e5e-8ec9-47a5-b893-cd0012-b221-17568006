    'use client';

    import { useState } from 'react';
    import { ConnectWallet } from '@coinbase/onchainkit/wallet';
    import InfluencerCard from './components/InfluencerCard';
    import CampaignBriefForm from './components/CampaignBriefForm';
    import AnalyticsChart from './components/AnalyticsChart';

    // Simulated data for MVP
    const mockInfluencers = [
      { id: 1, name: 'Alice', followers: 5000, engagement: 0.05, niche: 'Tech', score: 85 },
      { id: 2, name: 'Bob', followers: 3000, engagement: 0.08, niche: 'Fashion', score: 90 },
    ];

    const mockCampaigns = [
      { id: 1, title: 'Tech Launch', status: 'Active', metrics: { reach: 10000, engagement: 500 } },
    ];

    export default function Home() {
      const [userRole, setUserRole] = useState(null); // 'business' or 'influencer'
      const [campaigns, setCampaigns] = useState(mockCampaigns);
      const [influencers, setInfluencers] = useState(mockInfluencers);

      const handleCreateCampaign = (campaign) => {
        setCampaigns([...campaigns, { ...campaign, id: campaigns.length + 1, status: 'Pending' }]);
      };

      const handleMatchInfluencers = () => {
        // Simulate AI matching
        alert('AI matching influencers based on campaign goals...');
      };

      return (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-display text-primary mb-lg">AI Influencer Matching Platform</h1>
          {!userRole && (
            <div className="mb-lg">
              <button onClick={() => setUserRole('business')} className="bg-accent text-white px-md py-sm rounded-md mr-md">I'm a Business</button>
              <button onClick={() => setUserRole('influencer')} className="bg-primary text-white px-md py-sm rounded-md">I'm an Influencer</button>
            </div>
          )}
          {userRole === 'business' && (
            <>
              <ConnectWallet />
              <button onClick={handleMatchInfluencers} className="bg-accent text-white px-md py-sm rounded-md mb-lg">Create Campaign</button>
              <CampaignBriefForm onSubmit={handleCreateCampaign} />
              <h2 className="text-body text-primary mb-md">Matched Influencers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {influencers.map((inf) => (
                  <InfluencerCard key={inf.id} influencer={inf} variant="detailed" />
                ))}
              </div>
              <h2 className="text-body text-primary mb-md">Campaign Analytics</h2>
              <AnalyticsChart data={campaigns} variant="bar" />
            </>
          )}
          {userRole === 'influencer' && (
            <>
              <ConnectWallet />
              <h2 className="text-body text-primary mb-md">Your Profile</h2>
              <InfluencerCard influencer={mockInfluencers[0]} variant="basic" />
              <h2 className="text-body text-primary mb-md">Pending Briefs</h2>
              <div className="bg-surface p-md rounded-lg shadow-card">
                <p className="text-body">Campaign Brief: Tech Launch</p>
                <button className="bg-accent text-white px-sm py-sm rounded-sm mr-sm">Approve</button>
                <button className="bg-primary text-white px-sm py-sm rounded-sm">Reject</button>
              </div>
            </>
          )}
        </div>
      );
    }
  