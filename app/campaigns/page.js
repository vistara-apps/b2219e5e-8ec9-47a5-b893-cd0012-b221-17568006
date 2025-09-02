'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CampaignsPage() {
  const { data: session, status } = useSession();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'draft', 'completed'

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCampaigns();
    }
  }, [status, filter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns?status=${filter}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      
      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  // For MVP, use mock data if no campaigns are fetched
  const mockCampaigns = [
    {
      id: '1',
      title: 'Summer Product Launch',
      description: 'Promote our new summer collection across social media platforms.',
      status: 'ACTIVE',
      budget: 5000,
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-07-15'),
      matchCount: 12,
      metrics: {
        impressions: 25000,
        engagement: 1200,
        conversions: 350,
      },
    },
    {
      id: '2',
      title: 'Holiday Promotion',
      description: 'Special holiday campaign to boost end-of-year sales.',
      status: 'DRAFT',
      budget: 3000,
      startDate: new Date('2023-11-15'),
      endDate: new Date('2023-12-31'),
      matchCount: 0,
      metrics: {
        impressions: 0,
        engagement: 0,
        conversions: 0,
      },
    },
    {
      id: '3',
      title: 'Brand Awareness Campaign',
      description: 'Increase brand visibility among target demographic.',
      status: 'COMPLETED',
      budget: 7500,
      startDate: new Date('2023-01-15'),
      endDate: new Date('2023-03-15'),
      matchCount: 15,
      metrics: {
        impressions: 85000,
        engagement: 4200,
        conversions: 950,
      },
    },
  ];

  const displayCampaigns = campaigns.length > 0 ? campaigns : mockCampaigns;
  
  // Filter campaigns based on selected filter
  const filteredCampaigns = filter === 'all' 
    ? displayCampaigns 
    : displayCampaigns.filter(campaign => campaign.status.toLowerCase() === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Link
          href="/campaigns/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent"
        >
          Create Campaign
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md ${
              filter === 'active'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-md ${
              filter === 'draft'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Draft
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md ${
              filter === 'completed'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new campaign.
            </p>
            <div className="mt-6">
              <Link
                href="/campaigns/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent"
              >
                Create Campaign
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Campaign
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Budget
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Timeline
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Matches
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Performance
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {campaign.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {campaign.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${campaign.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.matchCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.status === 'ACTIVE' || campaign.status === 'COMPLETED' ? (
                        <div>
                          <div className="flex items-center">
                            <span className="mr-2">Impressions:</span>
                            <span className="font-medium">{campaign.metrics?.impressions.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">Engagement:</span>
                            <span className="font-medium">{campaign.metrics?.engagement.toLocaleString()}</span>
                          </div>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-primary hover:text-accent mr-4"
                      >
                        View
                      </Link>
                      <Link
                        href={`/campaigns/${campaign.id}/edit`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

