import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/influencers - Get all influencers
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const niche = searchParams.get('niche');
    const platform = searchParams.get('platform');
    const minFollowers = searchParams.get('minFollowers') ? parseInt(searchParams.get('minFollowers')) : null;
    const minEngagement = searchParams.get('minEngagement') ? parseFloat(searchParams.get('minEngagement')) : null;
    const verified = searchParams.get('verified') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    const where = {};
    if (niche) {
      where.niche = {
        contains: niche,
        mode: 'insensitive',
      };
    }
    if (platform) {
      where.platform = platform;
    }
    if (minFollowers) {
      where.followers = {
        gte: minFollowers,
      };
    }
    if (minEngagement) {
      where.engagementRate = {
        gte: minEngagement,
      };
    }
    if (verified) {
      where.verified = true;
    }
    
    // Get influencers
    const influencers = await prisma.influencer.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    
    return NextResponse.json(influencers);
  } catch (error) {
    console.error('Error fetching influencers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch influencers' },
      { status: 500 }
    );
  }
}

