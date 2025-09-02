import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/campaigns/[id]/content - Submit content for a campaign
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    const data = await request.json();
    const { influencerId, contentUrl, notes } = data;
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Validate required fields
    if (!influencerId || !contentUrl) {
      return NextResponse.json(
        { error: 'Influencer ID and content URL are required' },
        { status: 400 }
      );
    }
    
    // Get campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Get influencer
    const influencer = await prisma.influencer.findUnique({
      where: { id: influencerId },
    });
    
    if (!influencer) {
      return NextResponse.json(
        { error: 'Influencer not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the influencer
    if (session.user.id !== influencer.userId && session.user.id !== campaign.businessId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Get influencer campaign
    const influencerCampaign = await prisma.influencerCampaign.findFirst({
      where: {
        campaignId: id,
        influencerId,
      },
    });
    
    if (!influencerCampaign) {
      return NextResponse.json(
        { error: 'Influencer is not assigned to this campaign' },
        { status: 404 }
      );
    }
    
    // Update influencer campaign with content
    const updatedInfluencerCampaign = await prisma.influencerCampaign.update({
      where: { id: influencerCampaign.id },
      data: {
        contentUrl,
        contentNotes: notes,
        contentStatus: 'SUBMITTED',
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json(updatedInfluencerCampaign);
  } catch (error) {
    console.error('Error submitting content:', error);
    return NextResponse.json(
      { error: 'Failed to submit content' },
      { status: 500 }
    );
  }
}

