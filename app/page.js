'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import WalletConnectButton from './components/WalletConnectButton';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI-Powered Micro-Influencer Matching
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect your business with pre-vetted micro-influencers and manage campaigns using intuitive tools.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {status === 'authenticated' ? (
              <Link 
                href="/dashboard" 
                className="bg-accent text-white px-6 py-3 rounded-md font-medium"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/register" 
                  className="bg-accent text-white px-6 py-3 rounded-md font-medium"
                >
                  Get Started
                </Link>
                <Link 
                  href="/login" 
                  className="bg-white text-primary px-6 py-3 rounded-md font-medium"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-bg">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface p-6 rounded-lg shadow-card">
              <h3 className="text-xl font-bold mb-3">AI Matching</h3>
              <p className="text-gray-600">
                Automatically match with micro-influencers based on campaign goals, audience demographics, and niche relevance.
              </p>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-card">
              <h3 className="text-xl font-bold mb-3">Authenticity Verification</h3>
              <p className="text-gray-600">
                Analyze follower counts and engagement metrics to flag potential bots or fake followers.
              </p>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-card">
              <h3 className="text-xl font-bold mb-3">Workflow Automation</h3>
              <p className="text-gray-600">
                Streamlined solution for briefing influencers, managing approvals, and processing payments.
              </p>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-card">
              <h3 className="text-xl font-bold mb-3">Performance Analytics</h3>
              <p className="text-gray-600">
                Visualize campaign metrics, influencer ROI, and overall success in an easy-to-understand format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-3">Create Campaign</h3>
              <p className="text-gray-600">
                Define your campaign parameters, goals, target audience, and budget.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-3">Match Influencers</h3>
              <p className="text-gray-600">
                Our AI algorithm suggests relevant influencers based on your campaign needs.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-3">Manage & Track</h3>
              <p className="text-gray-600">
                Approve content, process payments, and track performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Launch Your Campaign?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our platform and connect with authentic micro-influencers today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {status === 'authenticated' ? (
              <Link 
                href="/campaigns/create" 
                className="bg-accent text-white px-6 py-3 rounded-md font-medium"
              >
                Create Campaign
              </Link>
            ) : (
              <>
                <Link 
                  href="/register" 
                  className="bg-accent text-white px-6 py-3 rounded-md font-medium"
                >
                  Sign Up Now
                </Link>
                <div className="mt-2 sm:mt-0">
                  <WalletConnectButton variant="outline" />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">InfluencerMatch</h3>
              <p className="text-gray-400">AI-powered influencer marketing platform</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/about" className="hover:text-accent">About</Link>
              <Link href="/privacy" className="hover:text-accent">Privacy</Link>
              <Link href="/terms" className="hover:text-accent">Terms</Link>
              <Link href="/contact" className="hover:text-accent">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} InfluencerMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

