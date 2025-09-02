'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateCampaign() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goals: '',
    targetAudience: '',
    budget: '',
    startDate: '',
    endDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated or not a business
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'authenticated' && session?.user?.role !== 'BUSINESS') {
    router.push('/dashboard/influencer');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Format data for API
      const campaignData = {
        ...formData,
        budget: parseFloat(formData.budget),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      // Create campaign
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create campaign');
      }

      const campaign = await response.json();

      // Redirect to campaign page
      router.push(`/campaigns/${campaign.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError(error.message || 'Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-display text-primary mb-lg">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-display text-primary mb-lg">Create Campaign</h1>

      <div className="bg-surface p-md rounded-lg shadow-card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-sm border rounded-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-sm border rounded-sm"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Goals
            </label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className="w-full p-sm border rounded-sm"
              rows="3"
              required
              placeholder="What do you want to achieve with this campaign?"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <textarea
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full p-sm border rounded-sm"
              rows="3"
              required
              placeholder="Describe your ideal audience (age, interests, demographics, etc.)"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              Budget (USD)
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              className="w-full p-sm border rounded-sm"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date (Optional)
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-sm border rounded-sm"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date (Optional)
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-sm border rounded-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex justify-end">
            <Link
              href="/dashboard/business"
              className="bg-gray-100 text-gray-800 px-md py-sm rounded-md mr-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-accent text-white px-md py-sm rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

