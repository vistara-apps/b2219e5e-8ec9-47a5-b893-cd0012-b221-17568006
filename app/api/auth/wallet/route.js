import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/auth/wallet - Authenticate or register with wallet
export async function POST(request) {
  try {
    const data = await request.json();
    const { walletAddress, username, role } = data;
    
    // Validate required fields
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Check if user with this wallet address already exists
    let user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        influencer: true,
      },
    });
    
    // If user doesn't exist, create a new one
    if (!user) {
      // Validate required fields for new user
      if (!username || !role) {
        return NextResponse.json(
          { error: 'Username and role are required for new users' },
          { status: 400 }
        );
      }
      
      // Create new user
      user = await prisma.user.create({
        data: {
          username,
          email: `${walletAddress.substring(0, 8)}@wallet.user`, // Generate a placeholder email
          role,
          walletAddress,
        },
      });
      
      // If user is an influencer, create influencer profile
      if (role === 'INFLUENCER') {
        await prisma.influencer.create({
          data: {
            userId: user.id,
            platform: 'Farcaster',
            followers: 0,
            engagementRate: 0,
            niche: 'General',
            authenticityScore: 50,
          },
        });
        
        // Refresh user data with influencer profile
        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            influencer: true,
          },
        });
      }
    }
    
    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      influencer: user.influencer,
    });
  } catch (error) {
    console.error('Error authenticating with wallet:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with wallet' },
      { status: 500 }
    );
  }
}

