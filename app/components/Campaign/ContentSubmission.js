'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContentSubmission({ campaignId, influencerId, currentStatus }) {
  const router = useRouter();
  const [contentUrl, setContentUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
      
      // Validate content URL
      if (!contentUrl) {
        throw new Error('Content URL is required');
      }
      
      // Submit content
      const response = await fetch(`/api/campaigns/${campaignId}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          influencerId,
          contentUrl,
          notes,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit content');
      }
      
      setSuccess('Content submitted successfully!');
      setContentUrl('');
      setNotes('');
      
      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      console.error('Error submitting content:', error);
      setError(error.message || 'Failed to submit content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If content is already approved, show a success message
  if (currentStatus === 'APPROVED') {
    return (
      <div className="bg-surface p-md rounded-lg shadow-card">
        <h2 className="text-body font-bold mb-md">Content Submission</h2>
        <div className="bg-green-100 text-green-800 p-4 rounded-md">
          <p className="font-medium">Your content has been approved!</p>
          <p className="text-sm mt-1">The business will process your payment soon.</p>
        </div>
      </div>
    );
  }

  // If content is already submitted and pending review, show a pending message
  if (currentStatus === 'SUBMITTED') {
    return (
      <div className="bg-surface p-md rounded-lg shadow-card">
        <h2 className="text-body font-bold mb-md">Content Submission</h2>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-md">
          <p className="font-medium">Your content has been submitted and is pending review.</p>
          <p className="text-sm mt-1">You'll be notified when the business reviews your submission.</p>
        </div>
      </div>
    );
  }

  // If content was rejected, allow resubmission
  const isResubmission = currentStatus === 'REJECTED';

  return (
    <div className="bg-surface p-md rounded-lg shadow-card">
      <h2 className="text-body font-bold mb-md">
        {isResubmission ? 'Resubmit Content' : 'Submit Content'}
      </h2>
      
      {isResubmission && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4">
          <p className="font-medium">Your previous submission was rejected.</p>
          <p className="text-sm mt-1">Please review the feedback and submit revised content.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="contentUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Content URL
          </label>
          <input
            id="contentUrl"
            type="url"
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
            className="w-full p-sm border rounded-sm"
            placeholder="https://example.com/your-content"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide a link to your content (e.g., social media post, video, blog post)
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-sm border rounded-sm"
            rows="3"
            placeholder="Add any additional information about your submission"
          />
        </div>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        
        <button
          type="submit"
          className="bg-accent text-white px-md py-sm rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : isResubmission ? 'Resubmit Content' : 'Submit Content'}
        </button>
      </form>
    </div>
  );
}

