import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/campaigns - Get all campaigns
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
    const businessId = searchParams.get('businessId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    const where = {};
    if (businessId) {
      where.businessId = businessId;
    }
    if (status) {
      where.status = status;
    }
    
    // Get campaigns
    const campaigns = await prisma.campaign.findMany({
      where,
      skip,
      take: limit,
      include: {
        business: {
          select: {
            id: true,
            username: true,
          },
        },
        influencerCampaigns: {
          select: {
            id: true,
            influencerId: true,
            contentStatus: true,
            paymentStatus: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create a new campaign
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
    
    // Check if user is a business
    if (session.user.role !== 'BUSINESS') {
      return NextResponse.json(
        { error: 'Only businesses can create campaigns' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const { title, description, goals, targetAudience, budget, startDate, endDate } = data;
    
    // Validate required fields
    if (!title || !description || !goals || !targetAudience || !budget) {
      return NextResponse.json(
        { error: 'Title, description, goals, targetAudience, and budget are required' },
        { status: 400 }
      );
    }
    
    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        goals,
        targetAudience,
        budget,
        startDate,
        endDate,
        status: 'DRAFT',
        businessId: session.user.id,
      },
    });
    
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

