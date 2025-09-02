'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InfluencerCard from '@/app/components/InfluencerCard';
import AnalyticsChart from '@/app/components/AnalyticsChart';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Mock data for MVP
  const businessData = {
    campaigns: [
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
      { 
        id: '2', 
        title: 'Holiday Promotion', 
        status: 'DRAFT', 
        metrics: { 
          reach: 0, 
          engagement: 0,
          conversions: 0,
          roi: 0
        } 
      },
      { 
        id: '3', 
        title: 'Brand Awareness Campaign', 
        status: 'COMPLETED', 
        metrics: { 
          reach: 25000, 
          engagement: 1200,
          conversions: 350,
          roi: 3.2
        } 
      }
    ],
    matches: [
      { 
        id: '1', 
        influencerId: '101', 
        campaignId: '1', 
        status: 'ACCEPTED', 
        score: 0.92,
        influencer: {
          id: '101',
          name: 'Alice Johnson',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
          followers: 15000,
          engagement: 0.05,
          niche: ['Fashion', 'Lifestyle'],
          socialAccounts: [
            { platform: 'Instagram', username: '@alice_style' },
            { platform: 'TikTok', username: '@alicejohnson' }
          ]
        }
      },
      { 
        id: '2', 
        influencerId: '102', 
        campaignId: '1', 
        status: 'PENDING', 
        score: 0.88,
        influencer: {
          id: '102',
          name: 'Bob Smith',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
          followers: 25000,
          engagement: 0.04,
          niche: ['Fashion', 'Travel'],
          socialAccounts: [
            { platform: 'Instagram', username: '@bobsmith_travel' },
            { platform: 'YouTube', username: 'Bob Smith Vlogs' }
          ]
        }
      }
    ],
    analytics: {
      summary: {
        impressions: 35000,
        engagement: 1700,
        clicks: 800,
        conversions: 470,
        roi: 2.8
      },
      trends: [
        { date: 'Week 1', impressions: 8000, engagement: 400 },
        { date: 'Week 2', impressions: 8500, engagement: 420 },
        { date: 'Week 3', impressions: 9000, engagement: 450 },
        { date: 'Week 4', impressions: 9500, engagement: 480 }
      ]
    }
  };
  
  const influencerData = {
    profile: {
      id: '201',
      name: session?.user?.name || 'Your Name',
      image: session?.user?.image,
      bio: 'Fashion and lifestyle content creator passionate about sustainable fashion and minimalist living.',
      niche: ['Fashion', 'Lifestyle', 'Sustainability'],
      followers: 15000,
      engagement: 0.05,
      authenticity: 0.92,
      socialAccounts: [
        {
          id: '1',
          platform: 'Instagram',
          username: '@fashion_influencer',
          url: 'https://instagram.com/fashion_influencer',
          followers: 12000,
          engagement: 0.06,
          verified: true
        },
        {
          id: '2',
          platform: 'TikTok',
          username: '@fashion_tiktok',
          url: 'https://tiktok.com/@fashion_tiktok',
          followers: 8000,
          engagement: 0.08,
          verified: false
        }
      ]
    },
    opportunities: [
      {
        id: '1',
        campaignId: '1',
        score: 0.92,
        campaign: {
          id: '1',
          title: 'Summer Product Launch',
          budget: 5000,
          startDate: '2023-06-15',
          endDate: '2023-07-15',
          business: {
            id: '1',
            name: 'Acme Inc.',
            image: null
          }
        }
      },
      {
        id: '2',
        campaignId: '4',
        score: 0.85,
        campaign: {
          id: '4',
          title: 'Eco-Friendly Product Promotion',
          budget: 3000,
          startDate: '2023-07-01',
          endDate: '2023-07-31',
          business: {
            id: '2',
            name: 'Green Living Co.',
            image: null
          }
        }
      }
    ],
    analytics: {
      summary: {
        impressions: 25000,
        engagement: 1500,
        clicks: 600,
        earnings: 2500
      },
      trends: [
        { date: 'Week 1', impressions: 6000, engagement: 360 },
        { date: 'Week 2', impressions: 6200, engagement: 370 },
        { date: 'Week 3', impressions: 6400, engagement: 380 },
        { date: 'Week 4', impressions: 6600, engagement: 390 }
      ]
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      // In a real implementation, this would be determined by the user's role in the session
      // For MVP, we'll use a mock role
      setUserRole(session?.user?.role || 'BUSINESS');
      setLoading(false);
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router, session]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {userRole === 'BUSINESS' ? (
          <Link
            href="/campaigns/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent"
          >
            Create Campaign
          </Link>
        ) : (
          <Link
            href="/influencer/profile"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent"
          >
            Edit Profile
          </Link>
        )}
      </div>

      {userRole === 'BUSINESS' ? (
        <div className="space-y-8">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
              <p className="mt-1 text-2xl font-semibold">{businessData.analytics.summary.impressions.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Engagement</h3>
              <p className="mt-1 text-2xl font-semibold">{businessData.analytics.summary.engagement.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
              <p className="mt-1 text-2xl font-semibold">{businessData.analytics.summary.clicks.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Conversions</h3>
              <p className="mt-1 text-2xl font-semibold">{businessData.analytics.summary.conversions.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">ROI</h3>
              <p className="mt-1 text-2xl font-semibold">{businessData.analytics.summary.roi.toFixed(1)}x</p>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Performance Trends</h2>
              <Link href="/analytics" className="text-sm text-primary hover:text-accent">
                View Detailed Analytics
              </Link>
            </div>
            <div className="h-64">
              <AnalyticsChart data={businessData.analytics.trends} variant="line" />
            </div>
          </div>

          {/* Campaigns */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Your Campaigns</h2>
              <Link href="/campaigns" className="text-sm text-primary hover:text-accent">
                View All Campaigns
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Impressions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engagement
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROI
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {businessData.campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            campaign.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'DRAFT'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.metrics.reach.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.metrics.engagement.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.metrics.roi.toFixed(1)}x
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="text-primary hover:text-accent"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Influencer Matches */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Matches</h2>
              <Link href="/campaigns/1/matches" className="text-sm text-primary hover:text-accent">
                View All Matches
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businessData.matches.map((match) => (
                <div key={match.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 flex justify-between items-start">
                    <div className="flex items-center">
                      {match.influencer.image ? (
                        <img
                          src={match.influencer.image}
                          alt={match.influencer.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center">
                          {match.influencer.name.charAt(0)}
                        </div>
                      )}
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{match.influencer.name}</h3>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Match Score:</span>
                          <span className="ml-1 text-sm font-medium text-primary">{(match.score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        match.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800'
                          : match.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                    <Link
                      href={`/campaigns/1/matches/${match.id}`}
                      className="text-sm text-primary hover:text-accent"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Influencer Profile Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex flex-col items-center p-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4">
                  {influencerData.profile.image ? (
                    <img
                      src={influencerData.profile.image}
                      alt={influencerData.profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-bold">
                      {influencerData.profile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{influencerData.profile.name}</h2>
                <div className="mt-2 flex flex-wrap gap-1 justify-center">
                  {influencerData.profile.niche.map((niche) => (
                    <span
                      key={niche}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {niche}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="md:w-2/3 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Followers</h3>
                    <p className="text-xl font-bold text-gray-900">{influencerData.profile.followers.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
                    <p className="text-xl font-bold text-gray-900">{(influencerData.profile.engagement * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Authenticity Score</h3>
                    <p className="text-xl font-bold text-gray-900">{(influencerData.profile.authenticity * 100).toFixed(0)}/100</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Social Accounts</h3>
                  <div className="space-y-2">
                    {influencerData.profile.socialAccounts.map((account) => (
                      <div key={account.id} className="flex items-center">
                        <span className="text-sm font-medium">{account.platform}:</span>
                        <span className="ml-1 text-sm text-gray-600">{account.username}</span>
                        {account.verified && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Verified
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
              <p className="mt-1 text-2xl font-semibold">{influencerData.analytics.summary.impressions.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Engagement</h3>
              <p className="mt-1 text-2xl font-semibold">{influencerData.analytics.summary.engagement.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
              <p className="mt-1 text-2xl font-semibold">{influencerData.analytics.summary.clicks.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Earnings</h3>
              <p className="mt-1 text-2xl font-semibold">${influencerData.analytics.summary.earnings.toLocaleString()}</p>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Performance Trends</h2>
              <Link href="/analytics" className="text-sm text-primary hover:text-accent">
                View Detailed Analytics
              </Link>
            </div>
            <div className="h-64">
              <AnalyticsChart data={influencerData.analytics.trends} variant="line" />
            </div>
          </div>

          {/* Campaign Opportunities */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Campaign Opportunities</h2>
              <Link href="/opportunities" className="text-sm text-primary hover:text-accent">
                View All Opportunities
              </Link>
            </div>
            <div className="space-y-4">
              {influencerData.opportunities.map((opportunity) => (
                <div key={opportunity.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{opportunity.campaign.title}</h3>
                      <p className="text-sm text-gray-500">{opportunity.campaign.business.name}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {(opportunity.score * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Budget</span>
                      <p className="text-sm font-medium">${opportunity.campaign.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Timeline</span>
                      <p className="text-sm font-medium">
                        {new Date(opportunity.campaign.startDate).toLocaleDateString()} - {new Date(opportunity.campaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/opportunities/${opportunity.id}`}
                      className="text-sm text-primary hover:text-accent"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

