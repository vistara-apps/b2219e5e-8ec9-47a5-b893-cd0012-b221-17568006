import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { findMatches } from '@/lib/ai/matchingEngine';

/**
 * API endpoint to find matching influencers for a campaign
 * 
 * POST /api/ai/match
 * Body: { campaignId: string, options?: object }
 */
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { campaignId, options } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { message: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Get campaign data
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        business: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check authorization (only campaign owner or admin can access)
    if (
      campaign.business.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get all influencers
    const influencers = await prisma.influencer.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        socialAccounts: true,
      },
    });

    // Process influencers to match expected format
    const processedInfluencers = influencers.map(inf => ({
      id: inf.id,
      name: inf.user.name,
      followers: inf.followers,
      engagement: inf.engagement,
      niche: inf.niche,
      authenticity: inf.authenticity,
      socialAccounts: inf.socialAccounts,
    }));

    // Run AI matching algorithm
    const matches = await findMatches(campaign, processedInfluencers, options);

    // Save matches to database
    const savedMatches = await Promise.all(
      matches.slice(0, 20).map(async (match) => {
        // Check if match already exists
        const existingMatch = await prisma.campaignMatch.findFirst({
          where: {
            campaignId: campaign.id,
            influencerId: match.influencerId,
          },
        });

        if (existingMatch) {
          // Update existing match
          return prisma.campaignMatch.update({
            where: { id: existingMatch.id },
            data: { score: match.totalScore },
          });
        } else {
          // Create new match
          return prisma.campaignMatch.create({
            data: {
              campaignId: campaign.id,
              influencerId: match.influencerId,
              score: match.totalScore,
              status: 'PENDING',
            },
          });
        }
      })
    );

    return NextResponse.json({
      matches: matches.slice(0, 20),
      savedMatches,
    });
  } catch (error) {
    console.error('AI matching error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to get existing matches for a campaign
 * 
 * GET /api/ai/match?campaignId=xxx
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

    // Get campaign ID from query params
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json(
        { message: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Get campaign data
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        business: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check authorization (only campaign owner or admin can access)
    if (
      campaign.business.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get existing matches
    const matches = await prisma.campaignMatch.findMany({
      where: { campaignId },
      include: {
        influencer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            socialAccounts: true,
          },
        },
      },
      orderBy: { score: 'desc' },
    });

    // Format response
    const formattedMatches = matches.map(match => ({
      id: match.id,
      influencerId: match.influencerId,
      campaignId: match.campaignId,
      status: match.status,
      score: match.score,
      influencer: {
        id: match.influencer.id,
        name: match.influencer.user.name,
        image: match.influencer.user.image,
        followers: match.influencer.followers,
        engagement: match.influencer.engagement,
        niche: match.influencer.niche,
        socialAccounts: match.influencer.socialAccounts,
      },
    }));

    return NextResponse.json({ matches: formattedMatches });
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

