'use client';

import { useState } from 'react';

export default function CampaignBriefForm({ campaignId, influencerId, onSubmit }) {
  const [brief, setBrief] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate inputs
      if (!brief) {
        throw new Error('Brief is required');
      }
      
      if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
        throw new Error('Valid payment amount is required');
      }

      // Call the onSubmit callback or make API request directly
      if (onSubmit) {
        await onSubmit({
          campaignId,
          influencerId,
          brief,
          paymentAmount: parseFloat(paymentAmount),
        });
      } else {
        // Default API call if no callback provided
        const response = await fetch(`/api/campaigns/${campaignId}/briefs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            influencerId,
            brief,
            paymentAmount: parseFloat(paymentAmount),
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to send brief');
        }
      }

      setSuccess('Brief sent successfully!');
      setBrief('');
      setPaymentAmount('');
    } catch (error) {
      console.error('Error sending brief:', error);
      setError(error.message || 'Failed to send brief. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface p-md rounded-lg shadow-card">
      <h2 className="text-body font-bold mb-md">Send Campaign Brief</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="brief" className="block text-sm font-medium text-gray-700 mb-1">
            Brief Instructions
          </label>
          <textarea
            id="brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            className="w-full p-sm border rounded-sm"
            rows="4"
            placeholder="Provide detailed instructions for the influencer"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Amount (USD)
          </label>
          <input
            id="paymentAmount"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="w-full p-sm border rounded-sm"
            placeholder="e.g. 200"
            min="0"
            step="0.01"
            required
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <button
          type="submit"
          className="bg-accent text-white px-md py-sm rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Brief'}
        </button>
      </form>
    </div>
  );
}

