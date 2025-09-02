'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnalyticsChart from '@/app/components/AnalyticsChart';

export default function AnalyticsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState('month'); // 'week', 'month', 'quarter', 'year'
  const [campaignFilter, setCampaignFilter] = useState('all');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalytics();
    }
  }, [status, timeframe, campaignFilter]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from the API
      // For MVP, we'll use mock data
      const mockAnalytics = {
        summary: {
          impressions: 125000,
          engagement: 7500,
          clicks: 3200,
          conversions: 850,
          roi: 2.7
        },
        campaigns: [
          {
            id: '1',
            title: 'Summer Product Launch',
            status: 'ACTIVE',
            metrics: {
              impressions: 75000,
              engagement: 4500,
              clicks: 2100,
              conversions: 520,
              roi: 3.1
            }
          },
          {
            id: '2',
            title: 'Holiday Promotion',
            status: 'DRAFT',
            metrics: {
              impressions: 0,
              engagement: 0,
              clicks: 0,
              conversions: 0,
              roi: 0
            }
          },
          {
            id: '3',
            title: 'Brand Awareness Campaign',
            status: 'COMPLETED',
            metrics: {
              impressions: 50000,
              engagement: 3000,
              clicks: 1100,
              conversions: 330,
              roi: 2.2
            }
          }
        ],
        influencers: [
          {
            id: '101',
            name: 'Alice Johnson',
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
            metrics: {
              impressions: 45000,
              engagement: 2700,
              clicks: 1200,
              conversions: 310,
              roi: 3.5
            }
          },
          {
            id: '102',
            name: 'Bob Smith',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
            metrics: {
              impressions: 35000,
              engagement: 1800,
              clicks: 900,
              conversions: 240,
              roi: 2.8
            }
          },
          {
            id: '103',
            name: 'Carol Davis',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            metrics: {
              impressions: 45000,
              engagement: 3000,
              clicks: 1100,
              conversions: 300,
              roi: 3.2
            }
          }
        ],
        demographics: {
          age: [
            { group: '13-17', percentage: 5 },
            { group: '18-24', percentage: 25 },
            { group: '25-34', percentage: 40 },
            { group: '35-44', percentage: 20 },
            { group: '45-54', percentage: 7 },
            { group: '55+', percentage: 3 }
          ],
          gender: [
            { group: 'Male', percentage: 35 },
            { group: 'Female', percentage: 62 },
            { group: 'Other', percentage: 3 }
          ],
          location: [
            { group: 'United States', percentage: 65 },
            { group: 'United Kingdom', percentage: 12 },
            { group: 'Canada', percentage: 8 },
            { group: 'Australia', percentage: 5 },
            { group: 'Germany', percentage: 3 },
            { group: 'Other', percentage: 7 }
          ]
        },
        trends: {
          daily: [
            { date: '2023-06-01', impressions: 2500, engagement: 150 },
            { date: '2023-06-02', impressions: 2700, engagement: 160 },
            { date: '2023-06-03', impressions: 2400, engagement: 140 },
            { date: '2023-06-04', impressions: 2800, engagement: 170 },
            { date: '2023-06-05', impressions: 3000, engagement: 180 },
            { date: '2023-06-06', impressions: 2900, engagement: 175 },
            { date: '2023-06-07', impressions: 3100, engagement: 190 }
          ],
          weekly: [
            { date: 'Week 1', impressions: 18000, engagement: 1080 },
            { date: 'Week 2', impressions: 19500, engagement: 1170 },
            { date: 'Week 3', impressions: 21000, engagement: 1260 },
            { date: 'Week 4', impressions: 22500, engagement: 1350 }
          ],
          monthly: [
            { date: 'Jan', impressions: 75000, engagement: 4500 },
            { date: 'Feb', impressions: 82000, engagement: 4920 },
            { date: 'Mar', impressions: 90000, engagement: 5400 },
            { date: 'Apr', impressions: 88000, engagement: 5280 },
            { date: 'May', impressions: 95000, engagement: 5700 },
            { date: 'Jun', impressions: 105000, engagement: 6300 }
          ]
        }
      };
      
      setAnalytics(mockAnalytics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTrendData = () => {
    if (!analytics) return [];
    
    switch (timeframe) {
      case 'week':
        return analytics.trends.daily;
      case 'month':
        return analytics.trends.weekly;
      case 'quarter':
      case 'year':
        return analytics.trends.monthly;
      default:
        return analytics.trends.weekly;
    }
  };

  const getFilteredCampaigns = () => {
    if (!analytics) return [];
    
    if (campaignFilter === 'all') {
      return analytics.campaigns;
    }
    
    return analytics.campaigns.filter(campaign => campaign.status === campaignFilter);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">No Data!</strong>
        <span className="block sm:inline"> No analytics data available.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="all">All Campaigns</option>
            <option value="ACTIVE">Active Campaigns</option>
            <option value="COMPLETED">Completed Campaigns</option>
            <option value="DRAFT">Draft Campaigns</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
          <p className="mt-1 text-2xl font-semibold">{analytics.summary.impressions.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Engagement</h3>
          <p className="mt-1 text-2xl font-semibold">{analytics.summary.engagement.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
          <p className="mt-1 text-2xl font-semibold">{analytics.summary.clicks.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Conversions</h3>
          <p className="mt-1 text-2xl font-semibold">{analytics.summary.conversions.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">ROI</h3>
          <p className="mt-1 text-2xl font-semibold">{analytics.summary.roi.toFixed(1)}x</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h2>
        <div className="h-64">
          <AnalyticsChart data={getTrendData()} variant="line" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Campaign Performance</h2>
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
                    Conversions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredCampaigns().map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/campaigns/${campaign.id}`} className="hover:text-primary">
                          {campaign.title}
                        </Link>
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
                      {campaign.metrics.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.metrics.conversions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.metrics.roi.toFixed(1)}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Top Influencers</h2>
            <Link href="/influencers" className="text-sm text-primary hover:text-accent">
              View All Influencers
            </Link>
          </div>
          <div className="space-y-4">
            {analytics.influencers.map((influencer) => (
              <div key={influencer.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {influencer.image ? (
                    <img
                      src={influencer.image}
                      alt={influencer.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      {influencer.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-900">{influencer.name}</div>
                  <div className="text-xs text-gray-500">
                    Impressions: {influencer.metrics.impressions.toLocaleString()} | 
                    Conversions: {influencer.metrics.conversions.toLocaleString()}
                  </div>
                </div>
                <div className="ml-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {influencer.metrics.roi.toFixed(1)}x ROI
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Age Demographics</h2>
          <div className="space-y-2">
            {analytics.demographics.age.map((item) => (
              <div key={item.group} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{item.group}</div>
                <div className="flex-1 ml-2">
                  <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-100">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Gender Demographics</h2>
          <div className="space-y-2">
            {analytics.demographics.gender.map((item) => (
              <div key={item.group} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{item.group}</div>
                <div className="flex-1 ml-2">
                  <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-100">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        item.group === 'Male' ? 'bg-blue-500' : item.group === 'Female' ? 'bg-pink-500' : 'bg-purple-500'
                      }`}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Location Demographics</h2>
          <div className="space-y-2">
            {analytics.demographics.location.map((item) => (
              <div key={item.group} className="flex items-center">
                <div className="w-28 text-sm text-gray-600 truncate">{item.group}</div>
                <div className="flex-1 ml-2">
                  <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-100">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recommendations</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-md font-medium text-blue-800">Optimize Campaign Budget</h3>
            <p className="mt-1 text-sm text-blue-600">
              Based on performance data, consider reallocating 20% of your budget from Brand Awareness Campaign to Summer Product Launch for better ROI.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h3 className="text-md font-medium text-green-800">Top Performing Influencer</h3>
            <p className="mt-1 text-sm text-green-600">
              Alice Johnson is your top performing influencer with 3.5x ROI. Consider extending your partnership and increasing her campaign allocation.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="text-md font-medium text-purple-800">Audience Insight</h3>
            <p className="mt-1 text-sm text-purple-600">
              Your content resonates most with the 25-34 age demographic. Consider creating more targeted content for this group to maximize engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

