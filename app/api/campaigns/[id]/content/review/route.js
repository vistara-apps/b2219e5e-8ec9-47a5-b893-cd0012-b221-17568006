import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/campaigns/[id]/content/review - Review content for a campaign
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    const data = await request.json();
    const { influencerId, approved, feedback } = data;
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Validate required fields
    if (!influencerId || approved === undefined) {
      return NextResponse.json(
        { error: 'Influencer ID and approval status are required' },
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
    
    // Check if user is the campaign owner
    if (session.user.id !== campaign.businessId) {
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
    
    // Check if content has been submitted
    if (influencerCampaign.contentStatus !== 'SUBMITTED') {
      return NextResponse.json(
        { error: 'Content has not been submitted yet' },
        { status: 400 }
      );
    }
    
    // Update influencer campaign with review
    const updatedInfluencerCampaign = await prisma.influencerCampaign.update({
      where: { id: influencerCampaign.id },
      data: {
        contentStatus: approved ? 'APPROVED' : 'REJECTED',
        feedbackNotes: feedback,
        updatedAt: new Date(),
        // If approved, update payment status to PROCESSING
        ...(approved ? { paymentStatus: 'PROCESSING' } : {}),
      },
    });
    
    return NextResponse.json(updatedInfluencerCampaign);
  } catch (error) {
    console.error('Error reviewing content:', error);
    return NextResponse.json(
      { error: 'Failed to review content' },
      { status: 500 }
    );
  }
}

