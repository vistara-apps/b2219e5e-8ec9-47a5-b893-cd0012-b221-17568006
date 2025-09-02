import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/campaigns/[id] - Get campaign by ID
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
    
    // Get campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        business: {
          select: {
            id: true,
            username: true,
          },
        },
        influencerCampaigns: {
          include: {
            influencer: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

// PUT /api/campaigns/[id] - Update campaign
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    const data = await request.json();
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
    
    // Update campaign
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : campaign.title,
        description: data.description !== undefined ? data.description : campaign.description,
        goals: data.goals !== undefined ? data.goals : campaign.goals,
        targetAudience: data.targetAudience !== undefined ? data.targetAudience : campaign.targetAudience,
        budget: data.budget !== undefined ? data.budget : campaign.budget,
        startDate: data.startDate !== undefined ? data.startDate : campaign.startDate,
        endDate: data.endDate !== undefined ? data.endDate : campaign.endDate,
        status: data.status !== undefined ? data.status : campaign.status,
      },
      include: {
        business: {
          select: {
            id: true,
            username: true,
          },
        },
        influencerCampaigns: {
          include: {
            influencer: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    
    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE /api/campaigns/[id] - Delete campaign
export async function DELETE(request, { params }) {
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
    
    // Delete campaign
    await prisma.campaign.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'Campaign deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}

