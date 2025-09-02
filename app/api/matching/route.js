import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { findMatchingInfluencers } from '@/lib/matching/algorithm';

// GET /api/matching - Get matching influencers for a campaign
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
    const campaignId = searchParams.get('campaignId');
    
    // Validate required parameters
    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    // Get campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the campaign owner
    if (session.user.id !== campaign.businessId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Get matching options from query parameters
    const options = {
      minFollowers: searchParams.get('minFollowers') ? parseInt(searchParams.get('minFollowers')) : undefined,
      minEngagement: searchParams.get('minEngagement') ? parseFloat(searchParams.get('minEngagement')) : undefined,
      verifiedOnly: searchParams.get('verifiedOnly') === 'true',
      minAuthenticityScore: searchParams.get('minAuthenticityScore') ? parseInt(searchParams.get('minAuthenticityScore')) : 50,
    };
    
    // Find matching influencers
    const matchedInfluencers = await findMatchingInfluencers(campaignId, options);
    
    // Format response
    const formattedMatches = matchedInfluencers.map(match => ({
      influencer: match.influencer,
      matchScore: Math.round(match.matchScore.total),
      matchDetails: match.matchDetails,
    }));
    
    return NextResponse.json({
      campaignId,
      matches: formattedMatches,
    });
  } catch (error) {
    console.error('Error finding matching influencers:', error);
    return NextResponse.json(
      { error: 'Failed to find matching influencers' },
      { status: 500 }
    );
  }
}

