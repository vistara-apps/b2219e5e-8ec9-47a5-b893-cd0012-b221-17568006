'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import InfluencerCard from '@/app/components/InfluencerCard';
import AnalyticsChart from '@/app/components/AnalyticsChart';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [campaign, setCampaign] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'matches', 'analytics'
  const [runningMatch, setRunningMatch] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchCampaign();
      fetchMatches();
    }
  }, [status, params.id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from the API
      // For MVP, we'll use mock data
      const mockCampaign = {
        id: params.id,
        title: 'Summer Product Launch',
        description: 'Promote our new summer collection across social media platforms.',
        status: 'ACTIVE',
        budget: 5000,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-07-15'),
        goals: ['awareness', 'conversion'],
        targetAudience: {
          ageRange: [18, 34],
          genderDistribution: {
            male: 40,
            female: 60,
            other: 0
          },
          locations: ['United States', 'Canada', 'United Kingdom'],
          interests: ['fashion', 'beauty', 'lifestyle']
        },
        requirements: 'We are looking for authentic content that showcases our products in real-life settings. Please highlight the sustainable aspects of our collection.',
        metrics: {
          impressions: 25000,
          engagement: 1200,
          conversions: 350,
          roi: 2.4
        }
      };
      
      setCampaign(mockCampaign);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // For MVP, we'll use mock data
      const mockMatches = [
        {
          id: '1',
          influencerId: '101',
          campaignId: params.id,
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
          campaignId: params.id,
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
        },
        {
          id: '3',
          influencerId: '103',
          campaignId: params.id,
          status: 'PENDING',
          score: 0.85,
          influencer: {
            id: '103',
            name: 'Carol Davis',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            followers: 50000,
            engagement: 0.06,
            niche: ['Lifestyle', 'Beauty'],
            socialAccounts: [
              { platform: 'Instagram', username: '@carol_beauty' },
              { platform: 'TikTok', username: '@caroldavis' }
            ]
          }
        }
      ];
      
      setMatches(mockMatches);
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  };

  const handleRunMatch = async () => {
    try {
      setRunningMatch(true);
      
      // In a real implementation, this would call the AI matching API
      // For MVP, we'll simulate a delay and add new matches
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newMatches = [
        ...matches,
        {
          id: '4',
          influencerId: '104',
          campaignId: params.id,
          status: 'PENDING',
          score: 0.94,
          influencer: {
            id: '104',
            name: 'David Wilson',
            image: 'https://randomuser.me/api/portraits/men/2.jpg',
            followers: 35000,
            engagement: 0.07,
            niche: ['Fashion', 'Fitness'],
            socialAccounts: [
              { platform: 'Instagram', username: '@david_fit' },
              { platform: 'TikTok', username: '@davidwilson' }
            ]
          }
        },
        {
          id: '5',
          influencerId: '105',
          campaignId: params.id,
          status: 'PENDING',
          score: 0.91,
          influencer: {
            id: '105',
            name: 'Emma Brown',
            image: 'https://randomuser.me/api/portraits/women/3.jpg',
            followers: 45000,
            engagement: 0.05,
            niche: ['Fashion', 'Beauty'],
            socialAccounts: [
              { platform: 'Instagram', username: '@emma_beauty' },
              { platform: 'YouTube', username: 'Emma Brown Beauty' }
            ]
          }
        }
      ];
      
      setMatches(newMatches);
      
    } catch (err) {
      console.error('Error running match:', err);
    } finally {
      setRunningMatch(false);
    }
  };

  const handleUpdateMatchStatus = async (matchId, newStatus) => {
    try {
      // In a real implementation, this would call the API
      // For MVP, we'll update the local state
      setMatches(matches.map(match => 
        match.id === matchId ? { ...match, status: newStatus } : match
      ));
    } catch (err) {
      console.error('Error updating match status:', err);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Not Found!</strong>
        <span className="block sm:inline"> Campaign not found.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
        <div className="flex space-x-2">
          <Link
            href={`/campaigns/${campaign.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit Campaign
          </Link>
          {campaign.status === 'DRAFT' && (
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent"
              onClick={() => {
                // In a real implementation, this would call the API
                setCampaign({ ...campaign, status: 'ACTIVE' });
              }}
            >
              Launch Campaign
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${
                activeTab === 'matches'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('matches')}
            >
              Influencer Matches
            </button>
            <button
              className={`${
                activeTab === 'analytics'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : campaign.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                  <p className="mt-1 text-lg font-semibold">${campaign.budget.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
                  <p className="mt-1 text-sm">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Matches</h3>
                  <p className="mt-1 text-lg font-semibold">{matches.length}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">{campaign.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900">Campaign Goals</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {campaign.goals.map((goal) => (
                    <span
                      key={goal}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {goal.charAt(0).toUpperCase() + goal.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900">Target Audience</h2>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Age Range</h3>
                    <p className="mt-1">{campaign.targetAudience.ageRange[0]} - {campaign.targetAudience.ageRange[1]} years</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Gender Distribution</h3>
                    <p className="mt-1">
                      Male: {campaign.targetAudience.genderDistribution.male}% | 
                      Female: {campaign.targetAudience.genderDistribution.female}% | 
                      Other: {campaign.targetAudience.genderDistribution.other}%
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Interests</h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {campaign.targetAudience.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Locations</h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {campaign.targetAudience.locations.map((location) => (
                        <span
                          key={location}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900">Content Requirements</h2>
                <p className="mt-2 text-gray-600">{campaign.requirements}</p>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Influencer Matches</h2>
                <button
                  onClick={handleRunMatch}
                  disabled={runningMatch}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {runningMatch ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running AI Match...
                    </>
                  ) : (
                    'Run AI Match'
                  )}
                </button>
              </div>

              {matches.length === 0 ? (
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No matches found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Run the AI matching algorithm to find suitable influencers for your campaign.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matches.map((match) => (
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
                      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs text-gray-500">Followers</span>
                            <p className="text-sm font-medium">{match.influencer.followers.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Engagement</span>
                            <p className="text-sm font-medium">{(match.influencer.engagement * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <span className="text-xs text-gray-500">Niche</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {match.influencer.niche.map((n) => (
                            <span
                              key={n}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <span className="text-xs text-gray-500">Social Accounts</span>
                        <div className="mt-1 space-y-1">
                          {match.influencer.socialAccounts.map((account) => (
                            <div key={account.platform} className="flex items-center">
                              <span className="text-sm font-medium">{account.platform}:</span>
                              <span className="ml-1 text-sm text-gray-600">{account.username}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
                        <Link
                          href={`/influencers/${match.influencerId}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View Profile
                        </Link>
                        {match.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateMatchStatus(match.id, 'REJECTED')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleUpdateMatchStatus(match.id, 'ACCEPTED')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-accent"
                            >
                              Accept
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
                  <p className="mt-1 text-2xl font-semibold">{campaign.metrics.impressions.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Engagement</h3>
                  <p className="mt-1 text-2xl font-semibold">{campaign.metrics.engagement.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Conversions</h3>
                  <p className="mt-1 text-2xl font-semibold">{campaign.metrics.conversions.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">ROI</h3>
                  <p className="mt-1 text-2xl font-semibold">{campaign.metrics.roi.toFixed(1)}x</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Over Time</h2>
                <div className="h-64">
                  <AnalyticsChart data={[campaign]} variant="bar" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Influencer Performance</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Influencer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Impressions
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Engagement
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversions
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ROI
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {matches
                        .filter(match => match.status === 'ACCEPTED')
                        .map((match) => (
                          <tr key={match.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {match.influencer.image ? (
                                  <img
                                    src={match.influencer.image}
                                    alt={match.influencer.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                                    {match.influencer.name.charAt(0)}
                                  </div>
                                )}
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{match.influencer.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(Math.random() * 10000).toFixed(0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(Math.random() * 500).toFixed(0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(Math.random() * 100).toFixed(0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(Math.random() * 3 + 1).toFixed(1)}x
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

