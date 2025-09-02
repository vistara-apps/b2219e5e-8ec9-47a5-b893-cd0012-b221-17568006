'use client';

import { useState } from 'react';

export default function CampaignBriefForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    goals: initialData.goals || [],
    targetAudience: initialData.targetAudience || {
      ageRange: [18, 65],
      genderDistribution: {
        male: 50,
        female: 50,
        other: 0
      },
      locations: ['United States'],
      interests: []
    },
    budget: initialData.budget || 1000,
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    requirements: initialData.requirements || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleGoalChange = (goal) => {
    setForm(prev => {
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
    
    // Clear error when field is updated
    if (errors.goals) {
      setErrors(prev => ({
        ...prev,
        goals: null
      }));
    }
  };

  const handleAudienceChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        [field]: value
      }
    }));
  };

  const handleAgeRangeChange = (index, value) => {
    setForm(prev => {
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
    setForm(prev => ({
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
      if (!form.targetAudience.interests.includes(newInterest)) {
        setForm(prev => ({
          ...prev,
          targetAudience: {
            ...prev.targetAudience,
            interests: [...prev.targetAudience.interests, newInterest]
          }
        }));
      }
      e.target.value = '';
      
      // Clear error when field is updated
      if (errors.interests) {
        setErrors(prev => ({
          ...prev,
          interests: null
        }));
      }
    }
  };

  const handleInterestRemove = (interest) => {
    setForm(prev => ({
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
      if (!form.targetAudience.locations.includes(newLocation)) {
        setForm(prev => ({
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
    setForm(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        locations: prev.targetAudience.locations.filter(l => l !== location)
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) {
      newErrors.title = 'Campaign title is required';
    }
    
    if (!form.description.trim()) {
      newErrors.description = 'Campaign description is required';
    }
    
    if (form.goals.length === 0) {
      newErrors.goals = 'Please select at least one campaign goal';
    }
    
    if (form.targetAudience.interests.length === 0) {
      newErrors.interests = 'Please add at least one audience interest';
    }
    
    if (!form.budget || form.budget <= 0) {
      newErrors.budget = 'Please enter a valid budget amount';
    }
    
    if (!form.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!form.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (form.startDate && new Date(form.endDate) <= new Date(form.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    const genderTotal = 
      form.targetAudience.genderDistribution.male + 
      form.targetAudience.genderDistribution.female + 
      form.targetAudience.genderDistribution.other;
      
    if (genderTotal !== 100) {
      newErrors.genderDistribution = 'Gender distribution must total 100%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
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
            value={form.title}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Campaign Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
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
                checked={form.goals.includes('awareness')}
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
                checked={form.goals.includes('consideration')}
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
                checked={form.goals.includes('conversion')}
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
                checked={form.goals.includes('loyalty')}
                onChange={() => handleGoalChange('loyalty')}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="goal-loyalty" className="ml-2 block text-sm text-gray-900">
                Customer Loyalty
              </label>
            </div>
          </div>
          {errors.goals && (
            <p className="mt-1 text-sm text-red-600">{errors.goals}</p>
          )}
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
              value={form.targetAudience.ageRange[0]}
              onChange={(e) => handleAgeRangeChange(0, e.target.value)}
              className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span>to</span>
            <input
              type="number"
              min="13"
              max="100"
              value={form.targetAudience.ageRange[1]}
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
                value={form.targetAudience.genderDistribution.male}
                onChange={(e) => handleGenderDistributionChange('male', e.target.value)}
                className={`block w-full border ${errors.genderDistribution ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
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
                value={form.targetAudience.genderDistribution.female}
                onChange={(e) => handleGenderDistributionChange('female', e.target.value)}
                className={`block w-full border ${errors.genderDistribution ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
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
                value={form.targetAudience.genderDistribution.other}
                onChange={(e) => handleGenderDistributionChange('other', e.target.value)}
                className={`block w-full border ${errors.genderDistribution ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
              />
            </div>
          </div>
          {errors.genderDistribution && (
            <p className="mt-1 text-sm text-red-600">{errors.genderDistribution}</p>
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
              className={`block w-full border ${errors.interests ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.targetAudience.interests.map((interest) => (
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
          {errors.interests && (
            <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
          )}
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
            {form.targetAudience.locations.map((location) => (
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
              value={form.budget}
              onChange={handleChange}
              className={`block w-full pl-7 border ${errors.budget ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
            />
          </div>
          {errors.budget && (
            <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
          )}
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
              value={form.startDate}
              onChange={handleChange}
              className={`mt-1 block w-full border ${errors.startDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={form.endDate}
              onChange={handleChange}
              className={`mt-1 block w-full border ${errors.endDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
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
            value={form.requirements}
            onChange={handleChange}
            placeholder="Describe what type of content you're looking for, any specific requirements, dos and don'ts, etc."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {initialData.id ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </div>
      </div>
    </form>
  );
}

