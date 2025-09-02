'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function WalletConnectButton({ variant = 'default' }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState('BUSINESS');
  
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError('');
      
      if (!isConnected) {
        connect();
        return;
      }
      
      // If already connected to wallet but not logged in, show role select
      if (!session) {
        setShowRoleSelect(true);
        return;
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsConnecting(true);
      setError('');
      
      // Register or authenticate with wallet
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          username,
          role: selectedRole,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to authenticate with wallet');
      }
      
      const user = await response.json();
      
      // Sign in with credentials
      await signIn('credentials', {
        email: user.email,
        redirect: false,
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error authenticating with wallet:', error);
      setError(error.message || 'Failed to authenticate with wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Button styles based on variant
  const buttonClasses = {
    default: 'bg-accent text-white px-md py-sm rounded-md',
    outline: 'bg-white text-accent border border-accent px-md py-sm rounded-md',
  };

  if (showRoleSelect) {
    return (
      <div className="bg-surface p-md rounded-lg shadow-card max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-sm border rounded-sm"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I am a:
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="BUSINESS"
                  checked={selectedRole === 'BUSINESS'}
                  onChange={() => setSelectedRole('BUSINESS')}
                  className="mr-2"
                />
                Business
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="INFLUENCER"
                  checked={selectedRole === 'INFLUENCER'}
                  onChange={() => setSelectedRole('INFLUENCER')}
                  className="mr-2"
                />
                Influencer
              </label>
            </div>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowRoleSelect(false)}
              className="bg-gray-100 text-gray-800 px-md py-sm rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-accent text-white px-md py-sm rounded-md"
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={buttonClasses[variant]}
    >
      {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect Wallet'}
    </button>
  );
}

