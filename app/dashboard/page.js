'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Redirect to appropriate dashboard based on user role
    if (status === 'authenticated') {
      if (session.user.role === 'BUSINESS') {
        router.push('/dashboard/business');
      } else if (session.user.role === 'INFLUENCER') {
        router.push('/dashboard/influencer');
      }
    }
  }, [status, session, router]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-display text-primary mb-lg">Redirecting to your dashboard...</h1>
    </div>
  );
}

