'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function InfluencerProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({
    platform: '',
    followers: '',
    engagementRate: '',
    niche: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Redirect if not authenticated or not an influencer
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'INFLUENCER') {
      router.push('/dashboard/business');
      return;
    }

    // Fetch influencer profile
    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile();
    }
  }, [status, session, router]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${session.user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      
      if (data.influencer) {
        setProfile({
          platform: data.influencer.platform || '',
          followers: data.influencer.followers || '',
          engagementRate: data.influencer.engagementRate || '',
          niche: data.influencer.niche || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Format data for API
      const formattedData = {
        ...profile,
        followers: parseInt(profile.followers),
        engagementRate: parseFloat(profile.engagementRate),
      };

      // Update user profile
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
      <h1 className="text-display text-primary mb-lg">Edit Influencer Profile</h1>

      <div className="bg-surface p-md rounded-lg shadow-card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              value={profile.platform}
              onChange={handleChange}
              className="w-full p-sm border rounded-sm"
              required
            >
              <option value="">Select Platform</option>
              <option value="Farcaster">Farcaster</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="Twitter">Twitter</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="followers" className="block text-sm font-medium text-gray-700 mb-1">
              Followers
            </label>
            <input
              id="followers"
              name="followers"
              type="number"
              value={profile.followers}
              onChange={handleChange}
              className="w-full p-sm border rounded-sm"
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="engagementRate" className="block text-sm font-medium text-gray-700 mb-1">
              Engagement Rate (0-1)
            </label>
            <input
              id="engagementRate"
              name="engagementRate"
              type="number"
              value={profile.engagementRate}
              onChange={handleChange}
              className="w-full p-sm border rounded-sm"
              required
              min="0"
              max="1"
              step="0.01"
              placeholder="e.g. 0.05 for 5%"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter as a decimal. For example, 5% would be 0.05
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1">
              Niche
            </label>
            <select
              id="niche"
              name="niche"
              value={profile.niche}
              onChange={handleChange}
              className="w-full p-sm border rounded-sm"
              required
            >
              <option value="">Select Niche</option>
              <option value="Tech">Tech</option>
              <option value="Fashion">Fashion</option>
              <option value="Beauty">Beauty</option>
              <option value="Fitness">Fitness</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Gaming">Gaming</option>
              <option value="Crypto">Crypto</option>
              <option value="Finance">Finance</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Education">Education</option>
              <option value="Business">Business</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <button
            type="submit"
            className="bg-accent text-white px-md py-sm rounded-md"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

