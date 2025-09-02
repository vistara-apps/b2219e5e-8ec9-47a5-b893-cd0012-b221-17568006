import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { recommendCampaigns } from '@/lib/ai/matchingEngine';

/**
 * API endpoint to get campaign recommendations for an influencer
 * 
 * GET /api/ai/recommend?influencerId=xxx
 */
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get influencer ID from query params
    const { searchParams } = new URL(request.url);
    const influencerId = searchParams.get('influencerId');

    if (!influencerId) {
      return NextResponse.json(
        { message: 'Influencer ID is required' },
        { status: 400 }
      );
    }

    // Get influencer data
    const influencer = await prisma.influencer.findUnique({
      where: { id: influencerId },
      include: {
        user: true,
        socialAccounts: true,
      },
    });

    if (!influencer) {
      return NextResponse.json(
        { message: 'Influencer not found' },
        { status: 404 }
      );
    }

    // Check authorization (only the influencer or admin can access)
    if (
      influencer.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get active campaigns
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        business: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Process influencer to match expected format
    const processedInfluencer = {
      id: influencer.id,
      name: influencer.user.name,
      followers: influencer.followers,
      engagement: influencer.engagement,
      niche: influencer.niche,
      authenticity: influencer.authenticity,
      socialAccounts: influencer.socialAccounts,
    };

    // Run AI recommendation algorithm
    const recommendations = await recommendCampaigns(processedInfluencer, campaigns);

    // Format response
    const formattedRecommendations = recommendations.map(rec => ({
      campaignId: rec.campaignId,
      score: rec.score,
      campaign: {
        id: rec.campaign.id,
        title: rec.campaign.title,
        budget: rec.campaign.budget,
        startDate: rec.campaign.startDate,
        endDate: rec.campaign.endDate,
        business: {
          id: campaigns.find(c => c.id === rec.campaignId)?.business.id,
          name: campaigns.find(c => c.id === rec.campaignId)?.business.user.name,
          image: campaigns.find(c => c.id === rec.campaignId)?.business.user.image,
        },
      },
    }));

    return NextResponse.json({ recommendations: formattedRecommendations });
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

