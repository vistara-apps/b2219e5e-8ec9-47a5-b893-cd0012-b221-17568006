'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import InfluencerCard from '@/app/components/InfluencerCard';

export default function BusinessInfluencers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [influencers, setInfluencers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    niche: '',
    minFollowers: '',
    minEngagement: '',
    verified: false,
  });

  useEffect(() => {
    // Redirect if not authenticated or not a business
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'BUSINESS') {
      router.push('/dashboard/influencer');
      return;
    }

    // Fetch influencers
    fetchInfluencers();
  }, [status, session, router]);

  const fetchInfluencers = async () => {
    try {
      setIsLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.niche) queryParams.append('niche', filters.niche);
      if (filters.minFollowers) queryParams.append('minFollowers', filters.minFollowers);
      if (filters.minEngagement) queryParams.append('minEngagement', filters.minEngagement);
      if (filters.verified) queryParams.append('verified', 'true');
      
      const response = await fetch(`/api/influencers?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch influencers');
      }
      
      const data = await response.json();
      setInfluencers(data);
    } catch (error) {
      console.error('Error fetching influencers:', error);
      setError('Failed to load influencers. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchInfluencers();
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-display text-primary mb-lg">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-display text-primary mb-lg">Browse Influencers</h1>

      {error && <p className="text-red-500 mb-lg">{error}</p>}

      <div className="bg-surface p-md rounded-lg shadow-card mb-lg">
        <h2 className="text-body font-bold mb-md">Filter Influencers</h2>
        <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          <div>
            <label className="block text-sm mb-1">Niche</label>
            <input
              type="text"
              name="niche"
              value={filters.niche}
              onChange={handleFilterChange}
              className="w-full p-sm border rounded-sm"
              placeholder="e.g. Tech, Fashion"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Min Followers</label>
            <input
              type="number"
              name="minFollowers"
              value={filters.minFollowers}
              onChange={handleFilterChange}
              className="w-full p-sm border rounded-sm"
              placeholder="e.g. 1000"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Min Engagement Rate</label>
            <input
              type="number"
              name="minEngagement"
              value={filters.minEngagement}
              onChange={handleFilterChange}
              className="w-full p-sm border rounded-sm"
              placeholder="e.g. 0.05 (5%)"
              step="0.01"
            />
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="verified"
                checked={filters.verified}
                onChange={handleFilterChange}
                className="mr-2"
              />
              <span className="text-sm">Verified Only</span>
            </label>
          </div>
          
          <div className="md:col-span-2 lg:col-span-4">
            <button type="submit" className="bg-accent text-white px-md py-sm rounded-md">
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {influencers.length === 0 ? (
        <div className="bg-surface p-md rounded-lg shadow-card text-center py-10">
          <p>No influencers found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {influencers.map((influencer) => (
            <InfluencerCard 
              key={influencer.id} 
              influencer={{
                id: influencer.id,
                name: influencer.user.username,
                followers: influencer.followers,
                engagement: influencer.engagementRate,
                niche: influencer.niche,
                score: influencer.authenticityScore,
                verified: influencer.verified,
              }} 
              variant="detailed" 
            />
          ))}
        </div>
      )}
    </div>
  );
}

