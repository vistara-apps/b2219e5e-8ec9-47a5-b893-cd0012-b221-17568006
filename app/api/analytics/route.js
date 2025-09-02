import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/analytics - Get analytics data
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
    const timeframe = searchParams.get('timeframe') || 'all';
    
    // Check if user is requesting their own analytics or is an admin
    if (businessId && session.user.id !== businessId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // For this MVP, we'll return mock analytics data
    // In a real implementation, this would query the database for actual metrics
    
    // Get date range based on timeframe
    const getDateRange = () => {
      const now = new Date();
      if (timeframe === 'week') {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return { gte: oneWeekAgo };
      } else if (timeframe === 'month') {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return { gte: oneMonthAgo };
      }
      return {}; // All time
    };
    
    // Get campaigns for this business
    const campaigns = await prisma.campaign.findMany({
      where: {
        businessId: businessId || session.user.id,
        createdAt: getDateRange(),
      },
      include: {
        influencerCampaigns: {
          include: {
            influencer: true,
          },
        },
      },
    });
    
    // Generate mock analytics data
    const mockAnalytics = {
      summary: {
        totalReach: 0,
        totalEngagement: 0,
        totalSpend: 0,
        overallROI: 0,
        campaignCount: campaigns.length,
      },
      campaigns: [],
    };
    
    // Calculate metrics for each campaign
    campaigns.forEach(campaign => {
      const influencerCount = campaign.influencerCampaigns.length;
      
      // Calculate total followers across all influencers
      const totalFollowers = campaign.influencerCampaigns.reduce(
        (sum, ic) => sum + (ic.influencer?.followers || 0),
        0
      );
      
      // Generate mock metrics
      const reach = totalFollowers;
      const engagement = Math.floor(reach * (Math.random() * 0.05 + 0.01)); // 1-6% engagement rate
      const spend = campaign.budget || 0;
      const roi = (engagement / spend) * 100; // ROI as percentage
      
      // Add to summary
      mockAnalytics.summary.totalReach += reach;
      mockAnalytics.summary.totalEngagement += engagement;
      mockAnalytics.summary.totalSpend += spend;
      
      // Add campaign metrics
      mockAnalytics.campaigns.push({
        id: campaign.id,
        title: campaign.title,
        status: campaign.status,
        reach,
        engagement,
        spend,
        roi,
        influencers: influencerCount,
      });
    });
    
    // Calculate overall ROI
    if (mockAnalytics.summary.totalSpend > 0) {
      mockAnalytics.summary.overallROI = (mockAnalytics.summary.totalEngagement / mockAnalytics.summary.totalSpend) * 100;
    }
    
    // Sort campaigns by engagement (descending)
    mockAnalytics.campaigns.sort((a, b) => b.engagement - a.engagement);
    
    return NextResponse.json(mockAnalytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

