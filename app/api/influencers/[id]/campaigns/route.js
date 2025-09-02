import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/influencers/[id]/campaigns - Get campaigns for an influencer
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get influencer
    const influencer = await prisma.influencer.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    
    if (!influencer) {
      return NextResponse.json(
        { error: 'Influencer not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the influencer or a business with campaigns for this influencer
    const isOwner = session.user.id === influencer.userId;
    
    if (!isOwner && session.user.role !== 'BUSINESS') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Get campaigns for this influencer
    const influencerCampaigns = await prisma.influencerCampaign.findMany({
      where: {
        influencerId: id,
        ...(session.user.role === 'BUSINESS' ? { campaign: { businessId: session.user.id } } : {}),
      },
      include: {
        campaign: {
          include: {
            business: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json(influencerCampaigns);
  } catch (error) {
    console.error('Error fetching influencer campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch influencer campaigns' },
      { status: 500 }
    );
  }
}

