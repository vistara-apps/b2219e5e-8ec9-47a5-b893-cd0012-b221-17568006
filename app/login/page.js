'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import WalletConnectButton from '@/app/components/WalletConnectButton';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError('Invalid email or password');
        return;
      }
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-display text-primary text-center mb-lg">Login</h1>
      
      <div className="bg-surface p-md rounded-lg shadow-card mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-sm border rounded-sm"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-sm border rounded-sm"
              required
            />
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-accent text-white px-md py-sm rounded-md mb-4"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-accent hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">Or connect with wallet</p>
        <div className="flex justify-center">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
}

