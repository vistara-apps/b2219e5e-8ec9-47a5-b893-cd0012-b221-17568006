'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', roles: ['BUSINESS', 'INFLUENCER', 'ADMIN'] },
    { name: 'Campaigns', href: '/campaigns', roles: ['BUSINESS', 'ADMIN'] },
    { name: 'Opportunities', href: '/opportunities', roles: ['INFLUENCER'] },
    { name: 'Messages', href: '/messages', roles: ['BUSINESS', 'INFLUENCER', 'ADMIN'] },
    { name: 'Analytics', href: '/analytics', roles: ['BUSINESS', 'INFLUENCER', 'ADMIN'] },
    { name: 'Settings', href: '/settings', roles: ['BUSINESS', 'INFLUENCER', 'ADMIN'] },
  ];

  const filteredNavigation = session?.user?.role
    ? navigation.filter(item => item.roles.includes(session.user.role))
    : [];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                InfluencerMatch
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {status === 'authenticated' && filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${isActive(item.href)} inline-flex items-center px-1 pt-1 border-b-2 ${
                    pathname === item.href ? 'border-primary' : 'border-transparent'
                  } text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === 'authenticated' ? (
              <div className="ml-3 relative flex items-center space-x-4">
                <Link href="/notifications" className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </Link>
                <div className="relative">
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    id="user-menu-button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    {session.user.image ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={session.user.image}
                        alt={session.user.name || "User"}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </button>
                  {mobileMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex="-1"
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-white hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          {status === 'authenticated' && filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                isActive(item.href)
              } block pl-3 pr-4 py-2 border-l-4 ${
                pathname === item.href ? 'border-primary' : 'border-transparent'
              } text-base font-medium`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        {status === 'authenticated' ? (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                {session.user.image ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || "User"}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{session.user.name}</div>
                <div className="text-sm font-medium text-gray-500">{session.user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Your Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-around">
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="block px-4 py-2 text-base font-medium text-primary hover:text-accent"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

