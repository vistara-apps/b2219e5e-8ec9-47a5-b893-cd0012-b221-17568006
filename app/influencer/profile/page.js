'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function InfluencerProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    niche: [],
    socialAccounts: []
  });
  const [newSocialAccount, setNewSocialAccount] = useState({
    platform: '',
    username: '',
    url: ''
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from the API
      // For MVP, we'll use mock data
      const mockProfile = {
        id: '101',
        userId: session?.user?.id,
        user: {
          name: session?.user?.name || 'Influencer Name',
          email: session?.user?.email || 'influencer@example.com',
          image: session?.user?.image || null
        },
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
        ],
        portfolioItems: [
          {
            id: '1',
            title: 'Summer Fashion Campaign',
            description: 'Collaboration with SummerBrand featuring their new collection.',
            mediaUrl: 'https://example.com/portfolio1.jpg',
            mediaType: 'IMAGE',
            platform: 'Instagram',
            engagement: 1500
          },
          {
            id: '2',
            title: 'Sustainable Living Tips',
            description: 'Video series on sustainable fashion choices.',
            mediaUrl: 'https://example.com/portfolio2.mp4',
            mediaType: 'VIDEO',
            platform: 'TikTok',
            engagement: 2500
          }
        ]
      };
      
      setProfile(mockProfile);
      setFormData({
        bio: mockProfile.bio,
        niche: mockProfile.niche,
        socialAccounts: mockProfile.socialAccounts
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNicheChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        niche: [...prev.niche, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        niche: prev.niche.filter(item => item !== value)
      }));
    }
  };

  const handleSocialAccountChange = (index, field, value) => {
    setFormData(prev => {
      const updatedAccounts = [...prev.socialAccounts];
      updatedAccounts[index] = {
        ...updatedAccounts[index],
        [field]: value
      };
      return {
        ...prev,
        socialAccounts: updatedAccounts
      };
    });
  };

  const handleNewSocialAccountChange = (field, value) => {
    setNewSocialAccount(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSocialAccount = () => {
    if (newSocialAccount.platform && newSocialAccount.username && newSocialAccount.url) {
      setFormData(prev => ({
        ...prev,
        socialAccounts: [
          ...prev.socialAccounts,
          {
            ...newSocialAccount,
            id: `new-${Date.now()}`,
            followers: 0,
            engagement: 0,
            verified: false
          }
        ]
      }));
      setNewSocialAccount({
        platform: '',
        username: '',
        url: ''
      });
    }
  };

  const removeSocialAccount = (index) => {
    setFormData(prev => ({
      ...prev,
      socialAccounts: prev.socialAccounts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In a real implementation, this would call the API
      // For MVP, we'll update the local state
      setProfile(prev => ({
        ...prev,
        bio: formData.bio,
        niche: formData.niche,
        socialAccounts: formData.socialAccounts
      }));
      
      setEditing(false);
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

  if (!profile) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Profile Not Found!</strong>
        <span className="block sm:inline"> Please complete your profile setup.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Influencer Profile</h1>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={() => setEditing(false)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {!editing ? (
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex flex-col items-center p-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4">
                  {profile.user.image ? (
                    <img
                      src={profile.user.image}
                      alt={profile.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-bold">
                      {profile.user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{profile.user.name}</h2>
                <p className="text-gray-500 mb-4">{profile.user.email}</p>
                
                <div className="w-full space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Followers</h3>
                    <p className="text-2xl font-bold text-gray-900">{profile.followers.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
                    <p className="text-2xl font-bold text-gray-900">{(profile.engagement * 100).toFixed(1)}%</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Authenticity Score</h3>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">{(profile.authenticity * 100).toFixed(0)}</span>
                      <span className="text-lg text-gray-500">/100</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3 p-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Niche</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.niche.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Social Accounts</h3>
                  <div className="space-y-4">
                    {profile.socialAccounts.map((account) => (
                      <div key={account.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-md font-medium text-gray-900">{account.platform}</h4>
                            <p className="text-gray-600">{account.username}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Followers: {account.followers.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Engagement: {(account.engagement * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <a
                            href={account.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-accent text-sm"
                          >
                            View Profile
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Portfolio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.portfolioItems.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          {item.mediaType === 'IMAGE' ? (
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="text-md font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{item.platform}</span>
                            <span className="text-xs text-gray-500">Engagement: {item.engagement.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href="/influencer/portfolio"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Manage Portfolio
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Niche (Select all that apply)
                </label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Fashion', 'Beauty', 'Lifestyle', 'Travel', 'Fitness', 'Food', 'Technology', 'Gaming', 'Business', 'Education', 'Entertainment', 'Art', 'Photography', 'Sports', 'Music', 'Health', 'Parenting', 'Pets', 'Home', 'DIY', 'Sustainability'].map((niche) => (
                    <div key={niche} className="flex items-center">
                      <input
                        id={`niche-${niche}`}
                        name="niche"
                        type="checkbox"
                        value={niche}
                        checked={formData.niche.includes(niche)}
                        onChange={handleNicheChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor={`niche-${niche}`} className="ml-2 block text-sm text-gray-900">
                        {niche}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Social Accounts
                </label>
                <div className="mt-2 space-y-4">
                  {formData.socialAccounts.map((account, index) => (
                    <div key={account.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor={`platform-${index}`} className="block text-xs font-medium text-gray-500">
                            Platform
                          </label>
                          <select
                            id={`platform-${index}`}
                            value={account.platform}
                            onChange={(e) => handleSocialAccountChange(index, 'platform', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          >
                            <option value="">Select Platform</option>
                            <option value="Instagram">Instagram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Facebook">Facebook</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Pinterest">Pinterest</option>
                            <option value="Snapchat">Snapchat</option>
                            <option value="Twitch">Twitch</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor={`username-${index}`} className="block text-xs font-medium text-gray-500">
                            Username
                          </label>
                          <input
                            type="text"
                            id={`username-${index}`}
                            value={account.username}
                            onChange={(e) => handleSocialAccountChange(index, 'username', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor={`url-${index}`} className="block text-xs font-medium text-gray-500">
                            Profile URL
                          </label>
                          <input
                            type="url"
                            id={`url-${index}`}
                            value={account.url}
                            onChange={(e) => handleSocialAccountChange(index, 'url', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeSocialAccount(index)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Social Account</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="new-platform" className="block text-xs font-medium text-gray-500">
                          Platform
                        </label>
                        <select
                          id="new-platform"
                          value={newSocialAccount.platform}
                          onChange={(e) => handleNewSocialAccountChange('platform', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          <option value="">Select Platform</option>
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Twitter">Twitter</option>
                          <option value="Facebook">Facebook</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Pinterest">Pinterest</option>
                          <option value="Snapchat">Snapchat</option>
                          <option value="Twitch">Twitch</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="new-username" className="block text-xs font-medium text-gray-500">
                          Username
                        </label>
                        <input
                          type="text"
                          id="new-username"
                          value={newSocialAccount.username}
                          onChange={(e) => handleNewSocialAccountChange('username', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-url" className="block text-xs font-medium text-gray-500">
                          Profile URL
                        </label>
                        <input
                          type="url"
                          id="new-url"
                          value={newSocialAccount.url}
                          onChange={(e) => handleNewSocialAccountChange('url', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={addSocialAccount}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Add Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

