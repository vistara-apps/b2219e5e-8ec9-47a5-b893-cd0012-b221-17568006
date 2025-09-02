'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InfluencerEarnings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [earnings, setEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('all');

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

    // Fetch earnings for this influencer
    if (status === 'authenticated' && session?.user?.id) {
      fetchEarnings();
    }
  }, [status, session, router, timeframe]);

  const fetchEarnings = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would be a dedicated endpoint
      // For this MVP, we'll simulate it
      
      // Simulate fetching earnings for this influencer
      const mockEarnings = [
        {
          id: '1',
          campaignId: '101',
          campaign: {
            id: '101',
            title: 'Tech Product Launch',
            business: { username: 'TechCorp' },
          },
          paymentStatus: 'PAID',
          paymentAmount: 200,
          paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          campaignId: '102',
          campaign: {
            id: '102',
            title: 'Fitness App Promotion',
            business: { username: 'FitLife' },
          },
          paymentStatus: 'PROCESSING',
          paymentAmount: 150,
          paymentDate: null,
        },
        {
          id: '3',
          campaignId: '103',
          campaign: {
            id: '103',
            title: 'Crypto Wallet Feature',
            business: { username: 'CryptoWallet' },
          },
          paymentStatus: 'PAID',
          paymentAmount: 300,
          paymentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      // Filter by timeframe
      let filteredEarnings = mockEarnings;
      if (timeframe === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filteredEarnings = mockEarnings.filter(e => 
          e.paymentDate && new Date(e.paymentDate) >= oneMonthAgo
        );
      } else if (timeframe === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredEarnings = mockEarnings.filter(e => 
          e.paymentDate && new Date(e.paymentDate) >= oneWeekAgo
        );
      }
      
      setEarnings(filteredEarnings);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      setError('Failed to load earnings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary metrics
  const totalEarned = earnings
    .filter(e => e.paymentStatus === 'PAID')
    .reduce((sum, e) => sum + e.paymentAmount, 0);
  
  const pendingPayments = earnings
    .filter(e => e.paymentStatus === 'PROCESSING')
    .reduce((sum, e) => sum + e.paymentAmount, 0);

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'UNPAID':
        return 'bg-gray-100 text-gray-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <h1 className="text-display text-primary mb-lg">Your Earnings</h1>

      {error && <p className="text-red-500 mb-lg">{error}</p>}

      <div className="mb-lg">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              timeframe === 'all' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-full text-sm ${
              timeframe === 'month' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Last Month
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 rounded-full text-sm ${
              timeframe === 'week' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Last Week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h3 className="text-sm text-gray-500 mb-sm">Total Earned</h3>
          <p className="text-display">${totalEarned.toFixed(2)}</p>
          <p className="text-sm text-gray-500">
            {timeframe === 'all' ? 'all time' : 
             timeframe === 'month' ? 'last month' : 'last week'}
          </p>
        </div>
        
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h3 className="text-sm text-gray-500 mb-sm">Pending Payments</h3>
          <p className="text-display">${pendingPayments.toFixed(2)}</p>
          <p className="text-sm text-gray-500">across {earnings.filter(e => e.paymentStatus === 'PROCESSING').length} campaigns</p>
        </div>
      </div>

      <div className="bg-surface p-md rounded-lg shadow-card">
        <h2 className="text-body font-bold mb-md">Payment History</h2>
        
        {earnings.length === 0 ? (
          <p className="text-center py-4">No earnings found for the selected timeframe.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Campaign</th>
                  <th className="text-left py-2 px-4">Business</th>
                  <th className="text-right py-2 px-4">Amount</th>
                  <th className="text-center py-2 px-4">Status</th>
                  <th className="text-right py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((earning) => (
                  <tr key={earning.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">
                      <Link href={`/campaigns/${earning.campaignId}`} className="text-primary hover:underline">
                        {earning.campaign.title}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{earning.campaign.business.username}</td>
                    <td className="text-right py-2 px-4">${earning.paymentAmount.toFixed(2)}</td>
                    <td className="py-2 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusClass(earning.paymentStatus)}`}>
                        {earning.paymentStatus}
                      </span>
                    </td>
                    <td className="text-right py-2 px-4">
                      {earning.paymentDate ? new Date(earning.paymentDate).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-lg bg-surface p-md rounded-lg shadow-card">
        <h2 className="text-body font-bold mb-md">Payment Methods</h2>
        <div className="p-sm bg-gray-50 rounded-sm mb-md">
          <p className="text-sm">
            Connect your wallet to receive payments directly to your Base Wallet.
          </p>
        </div>
        
        <button className="bg-accent text-white px-md py-sm rounded-md">
          Connect Payment Method
        </button>
      </div>
    </div>
  );
}

