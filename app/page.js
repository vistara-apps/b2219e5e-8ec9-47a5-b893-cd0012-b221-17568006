'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import InfluencerCard from './components/InfluencerCard';
import CampaignBriefForm from './components/CampaignBriefForm';
import AnalyticsChart from './components/AnalyticsChart';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState(null); // 'business' or 'influencer'
  const [showDemo, setShowDemo] = useState(false);

  // Simulated data for MVP
  const mockInfluencers = [
    { 
      id: '1', 
      name: 'Alice Johnson', 
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      followers: 15000, 
      engagement: 0.05, 
      niche: ['Fashion', 'Lifestyle'], 
      authenticity: 0.85,
      score: 0.92,
      socialAccounts: [
        { platform: 'Instagram', username: '@alice_style' },
        { platform: 'TikTok', username: '@alicejohnson' }
      ]
    },
    { 
      id: '2', 
      name: 'Bob Smith', 
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      followers: 25000, 
      engagement: 0.04, 
      niche: ['Fashion', 'Travel'], 
      authenticity: 0.78,
      score: 0.88,
      socialAccounts: [
        { platform: 'Instagram', username: '@bobsmith_travel' },
        { platform: 'YouTube', username: 'Bob Smith Vlogs' }
      ]
    },
    { 
      id: '3', 
      name: 'Carol Davis', 
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      followers: 50000, 
      engagement: 0.06, 
      niche: ['Lifestyle', 'Beauty'], 
      authenticity: 0.92,
      score: 0.85,
      socialAccounts: [
        { platform: 'Instagram', username: '@carol_beauty' },
        { platform: 'TikTok', username: '@caroldavis' }
      ]
    },
  ];

  const mockCampaigns = [
    { 
      id: '1', 
      title: 'Summer Product Launch', 
      status: 'ACTIVE', 
      metrics: { 
        reach: 10000, 
        engagement: 500,
        conversions: 120,
        roi: 2.5
      } 
    },
  ];

  const mockAnalyticsData = [
    { date: 'Week 1', impressions: 18000, engagement: 1080 },
    { date: 'Week 2', impressions: 19500, engagement: 1170 },
    { date: 'Week 3', impressions: 21000, engagement: 1260 },
    { date: 'Week 4', impressions: 22500, engagement: 1350 }
  ];

  const handleCreateCampaign = (campaign) => {
    // In a real implementation, this would call the API
    // For MVP, we'll just show a success message
    alert('Campaign created successfully! Redirecting to dashboard...');
    router.push('/dashboard');
  };

  const handleMatchInfluencers = () => {
    // Simulate AI matching
    setShowDemo(true);
  };

  // If user is authenticated, redirect to dashboard
  if (status === 'authenticated') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                AI-Powered Influencer Matching
              </h1>
              <p className="mt-6 text-xl max-w-3xl">
                Connect with the perfect micro-influencers for your brand using our advanced AI matching algorithm. Maximize ROI and reach your target audience effectively.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setUserRole('business')} 
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
                >
                  I'm a Business
                </button>
                <button 
                  onClick={() => setUserRole('influencer')} 
                  className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-dark"
                >
                  I'm an Influencer
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                alt="Influencer Marketing" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific content */}
      {userRole && (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {userRole === 'business' ? 'Business Dashboard' : 'Influencer Dashboard'}
              </h2>
              
              <div className="mb-6">
                <ConnectWallet />
              </div>
              
              {userRole === 'business' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Create a Campaign</h3>
                    <CampaignBriefForm onSubmit={handleCreateCampaign} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">AI Influencer Matching</h3>
                      <button 
                        onClick={handleMatchInfluencers} 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent"
                      >
                        Run AI Match
                      </button>
                    </div>
                    
                    {showDemo ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mockInfluencers.map((influencer) => (
                          <InfluencerCard key={influencer.id} influencer={influencer} variant="detailed" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No matches yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Run the AI matching algorithm to find suitable influencers for your campaign.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Analytics</h3>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="h-64">
                        <AnalyticsChart data={mockAnalyticsData} variant="line" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {userRole === 'influencer' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h3>
                    <InfluencerCard 
                      influencer={{
                        id: '101',
                        name: session?.user?.name || 'Your Name',
                        image: session?.user?.image,
                        followers: 0,
                        engagement: 0,
                        niche: [],
                        authenticity: 0
                      }} 
                      variant="basic" 
                    />
                    <div className="mt-4 text-center">
                      <Link
                        href="/auth/register"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent"
                      >
                        Complete Your Profile
                      </Link>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Opportunities</h3>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-center text-gray-500">
                        Sign up to discover campaign opportunities that match your profile.
                      </p>
                      <div className="mt-4 text-center">
                        <Link
                          href="/auth/register"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent"
                        >
                          Sign Up Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      {!userRole && (
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform connects businesses with the perfect micro-influencers for their campaigns.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-12 w-12 bg-primary-100 text-primary rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">AI-Powered Matching</h3>
              <p className="mt-2 text-gray-600">
                Our advanced algorithm matches businesses with influencers based on audience demographics, engagement metrics, and content quality.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-12 w-12 bg-primary-100 text-primary rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Time-Saving</h3>
              <p className="mt-2 text-gray-600">
                Save hours of manual research and outreach. Our platform automates the influencer discovery and campaign management process.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-12 w-12 bg-primary-100 text-primary rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Authenticity Verification</h3>
              <p className="mt-2 text-gray-600">
                Our platform verifies influencer authenticity, ensuring you partner with genuine creators who have real engagement.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-12 w-12 bg-primary-100 text-primary rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Secure Payments</h3>
              <p className="mt-2 text-gray-600">
                Our platform handles all payments securely, with escrow protection for both businesses and influencers.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-12 w-12 bg-primary-100 text-primary rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Detailed Analytics</h3>
              <p className="mt-2 text-gray-600">
                Track campaign performance with comprehensive analytics, including reach, engagement, conversions, and ROI.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-12 w-12 bg-primary-100 text-primary rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Seamless Communication</h3>
              <p className="mt-2 text-gray-600">
                Built-in messaging system for direct communication between businesses and influencers throughout the campaign.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-light">Sign up today and transform your influencer marketing.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-dark hover:bg-primary-darker"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

