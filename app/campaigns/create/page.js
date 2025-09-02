'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CreateCampaignPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goals: [],
    targetAudience: {
      ageRange: [18, 65],
      genderDistribution: {
        male: 50,
        female: 50,
        other: 0
      },
      locations: ['United States'],
      interests: []
    },
    budget: 1000,
    startDate: '',
    endDate: '',
    requirements: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoalChange = (goal) => {
    setFormData(prev => {
      const goals = [...prev.goals];
      if (goals.includes(goal)) {
        return {
          ...prev,
          goals: goals.filter(g => g !== goal)
        };
      } else {
        return {
          ...prev,
          goals: [...goals, goal]
        };
      }
    });
  };

  const handleAudienceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        [field]: value
      }
    }));
  };

  const handleAgeRangeChange = (index, value) => {
    setFormData(prev => {
      const newAgeRange = [...prev.targetAudience.ageRange];
      newAgeRange[index] = parseInt(value, 10);
      return {
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          ageRange: newAgeRange
        }
      };
    });
  };

  const handleGenderDistributionChange = (gender, value) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        genderDistribution: {
          ...prev.targetAudience.genderDistribution,
          [gender]: parseInt(value, 10)
        }
      }
    }));
  };

  const handleInterestAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newInterest = e.target.value.trim();
      if (!formData.targetAudience.interests.includes(newInterest)) {
        setFormData(prev => ({
          ...prev,
          targetAudience: {
            ...prev.targetAudience,
            interests: [...prev.targetAudience.interests, newInterest]
          }
        }));
      }
      e.target.value = '';
    }
  };

  const handleInterestRemove = (interest) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        interests: prev.targetAudience.interests.filter(i => i !== interest)
      }
    }));
  };

  const handleLocationAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newLocation = e.target.value.trim();
      if (!formData.targetAudience.locations.includes(newLocation)) {
        setFormData(prev => ({
          ...prev,
          targetAudience: {
            ...prev.targetAudience,
            locations: [...prev.targetAudience.locations, newLocation]
          }
        }));
      }
      e.target.value = '';
    }
  };

  const handleLocationRemove = (location) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        locations: prev.targetAudience.locations.filter(l => l !== location)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form
      if (!formData.title || !formData.description || !formData.budget || !formData.startDate || !formData.endDate) {
        throw new Error('Please fill in all required fields');
      }
      
      if (formData.goals.length === 0) {
        throw new Error('Please select at least one campaign goal');
      }
      
      if (formData.targetAudience.interests.length === 0) {
        throw new Error('Please add at least one audience interest');
      }
      
      // Format data for API
      const campaignData = {
        ...formData,
        budget: parseFloat(formData.budget),
        targetAudience: JSON.stringify(formData.targetAudience),
      };
      
      // In a real implementation, this would call the API
      // For MVP, we'll simulate a successful response
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to campaigns page
      router.push('/campaigns');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>
        <Link
          href="/campaigns"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Campaign Details</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Campaign Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Campaign Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Campaign Goals <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="goal-awareness"
                    type="checkbox"
                    checked={formData.goals.includes('awareness')}
                    onChange={() => handleGoalChange('awareness')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="goal-awareness" className="ml-2 block text-sm text-gray-900">
                    Brand Awareness
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="goal-consideration"
                    type="checkbox"
                    checked={formData.goals.includes('consideration')}
                    onChange={() => handleGoalChange('consideration')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="goal-consideration" className="ml-2 block text-sm text-gray-900">
                    Product Consideration
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="goal-conversion"
                    type="checkbox"
                    checked={formData.goals.includes('conversion')}
                    onChange={() => handleGoalChange('conversion')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="goal-conversion" className="ml-2 block text-sm text-gray-900">
                    Conversion / Sales
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="goal-loyalty"
                    type="checkbox"
                    checked={formData.goals.includes('loyalty')}
                    onChange={() => handleGoalChange('loyalty')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="goal-loyalty" className="ml-2 block text-sm text-gray-900">
                    Customer Loyalty
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Target Audience</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age Range
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="number"
                  min="13"
                  max="100"
                  value={formData.targetAudience.ageRange[0]}
                  onChange={(e) => handleAgeRangeChange(0, e.target.value)}
                  className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                <span>to</span>
                <input
                  type="number"
                  min="13"
                  max="100"
                  value={formData.targetAudience.ageRange[1]}
                  onChange={(e) => handleAgeRangeChange(1, e.target.value)}
                  className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender Distribution (%)
              </label>
              <div className="mt-1 grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="gender-male" className="block text-xs text-gray-500">
                    Male
                  </label>
                  <input
                    type="number"
                    id="gender-male"
                    min="0"
                    max="100"
                    value={formData.targetAudience.genderDistribution.male}
                    onChange={(e) => handleGenderDistributionChange('male', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="gender-female" className="block text-xs text-gray-500">
                    Female
                  </label>
                  <input
                    type="number"
                    id="gender-female"
                    min="0"
                    max="100"
                    value={formData.targetAudience.genderDistribution.female}
                    onChange={(e) => handleGenderDistributionChange('female', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="gender-other" className="block text-xs text-gray-500">
                    Other
                  </label>
                  <input
                    type="number"
                    id="gender-other"
                    min="0"
                    max="100"
                    value={formData.targetAudience.genderDistribution.other}
                    onChange={(e) => handleGenderDistributionChange('other', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
              {formData.targetAudience.genderDistribution.male + formData.targetAudience.genderDistribution.female + formData.targetAudience.genderDistribution.other !== 100 && (
                <p className="mt-1 text-sm text-red-600">
                  Gender distribution should total 100%
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interests <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  placeholder="Type an interest and press Enter"
                  onKeyDown={handleInterestAdd}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.targetAudience.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleInterestRemove(interest)}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-white hover:bg-primary-dark focus:outline-none"
                    >
                      <span className="sr-only">Remove {interest}</span>
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Locations
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  placeholder="Type a location and press Enter"
                  onKeyDown={handleLocationAdd}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.targetAudience.locations.map((location) => (
                  <span
                    key={location}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {location}
                    <button
                      type="button"
                      onClick={() => handleLocationRemove(location)}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 focus:outline-none"
                    >
                      <span className="sr-only">Remove {location}</span>
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Budget & Timeline</h2>
            
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                Campaign Budget (USD) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  min="100"
                  value={formData.budget}
                  onChange={handleChange}
                  className="block w-full pl-7 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Content Requirements</h2>
            
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                Content Guidelines & Requirements
              </label>
              <textarea
                name="requirements"
                id="requirements"
                rows={4}
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Describe what type of content you're looking for, any specific requirements, dos and don'ts, etc."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <Link
                href="/campaigns"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

