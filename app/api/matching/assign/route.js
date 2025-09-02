import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/matching/assign - Assign influencers to a campaign
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { campaignId, influencerIds, brief } = data;
    
    // Validate required fields
    if (!campaignId || !influencerIds || !Array.isArray(influencerIds) || influencerIds.length === 0) {
      return NextResponse.json(
        { error: 'Campaign ID and at least one influencer ID are required' },
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
    
    // Create influencer campaigns
    const influencerCampaigns = [];
    
    for (const influencerId of influencerIds) {
      // Check if influencer exists
      const influencer = await prisma.influencer.findUnique({
        where: { id: influencerId },
      });
      
      if (!influencer) {
        return NextResponse.json(
          { error: `Influencer with ID ${influencerId} not found` },
          { status: 404 }
        );
      }
      
      // Check if influencer is already assigned to this campaign
      const existingAssignment = await prisma.influencerCampaign.findFirst({
        where: {
          campaignId,
          influencerId,
        },
      });
      
      if (existingAssignment) {
        continue; // Skip if already assigned
      }
      
      // Create influencer campaign
      const influencerCampaign = await prisma.influencerCampaign.create({
        data: {
          campaignId,
          influencerId,
          brief: brief || campaign.description,
          contentStatus: 'PENDING',
          paymentStatus: 'UNPAID',
        },
      });
      
      influencerCampaigns.push(influencerCampaign);
    }
    
    // If campaign is in MATCHING status, update to ACTIVE
    if (campaign.status === 'MATCHING') {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          status: 'ACTIVE',
        },
      });
    }
    
    return NextResponse.json({
      campaignId,
      assignedInfluencers: influencerCampaigns.length,
      influencerCampaigns,
    });
  } catch (error) {
    console.error('Error assigning influencers:', error);
    return NextResponse.json(
      { error: 'Failed to assign influencers' },
      { status: 500 }
    );
  }
}

