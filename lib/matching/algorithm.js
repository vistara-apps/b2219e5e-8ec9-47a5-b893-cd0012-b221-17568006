import prisma from '@/lib/prisma';

/**
 * Find matching influencers for a campaign
 * @param {string} campaignId - The ID of the campaign
 * @param {Object} options - Matching options
 * @returns {Promise<Array>} - Array of matched influencers with scores
 */
export async function findMatchingInfluencers(campaignId, options = {}) {
  // Get campaign details
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });
  
  if (!campaign) {
    throw new Error('Campaign not found');
  }
  
  // Get influencers already assigned to this campaign
  const assignedInfluencers = await prisma.influencerCampaign.findMany({
    where: { campaignId },
    select: { influencerId: true },
  });
  
  const assignedInfluencerIds = assignedInfluencers.map(ic => ic.influencerId);
  
  // Build query for potential influencers
  const where = {
    id: { notIn: assignedInfluencerIds }, // Exclude already assigned influencers
  };
  
  // Apply filters from options
  if (options.minFollowers) {
    where.followers = { gte: options.minFollowers };
  }
  
  if (options.minEngagement) {
    where.engagementRate = { gte: options.minEngagement };
  }
  
  if (options.verifiedOnly) {
    where.verified = true;
  }
  
  if (options.minAuthenticityScore) {
    where.authenticityScore = { gte: options.minAuthenticityScore };
  }
  
  // Get potential influencers
  const influencers = await prisma.influencer.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
    take: 20, // Limit to 20 influencers for performance
  });
  
  // Calculate match scores
  const matchedInfluencers = influencers.map(influencer => {
    const matchScore = calculateMatchScore(campaign, influencer);
    return {
      influencer,
      matchScore,
      matchDetails: {
        nicheMatch: matchScore.nicheMatch,
        audienceMatch: matchScore.audienceMatch,
        engagementMatch: matchScore.engagementMatch,
        authenticityMatch: matchScore.authenticityMatch,
      },
    };
  });
  
  // Sort by total match score (descending)
  matchedInfluencers.sort((a, b) => b.matchScore.total - a.matchScore.total);
  
  return matchedInfluencers;
}

/**
 * Calculate match score between campaign and influencer
 * @param {Object} campaign - Campaign object
 * @param {Object} influencer - Influencer object
 * @returns {Object} - Match score components and total
 */
function calculateMatchScore(campaign, influencer) {
  // Niche match (30%)
  // In a real implementation, this would use NLP to compare campaign goals and target audience with influencer niche
  // For this MVP, we'll use a simple random score with some weighting
  const nicheMatch = Math.min(100, Math.max(0, 
    50 + (Math.random() * 50) + (influencer.niche.toLowerCase().includes('general') ? -20 : 20)
  ));
  
  // Audience match (25%)
  // In a real implementation, this would compare target audience demographics with influencer audience
  // For this MVP, we'll use a simple random score
  const audienceMatch = Math.min(100, Math.max(0, 
    60 + (Math.random() * 40)
  ));
  
  // Engagement match (25%)
  // Higher engagement rate = better match
  const engagementRate = influencer.engagementRate * 100; // Convert to percentage
  const engagementMatch = Math.min(100, Math.max(0,
    engagementRate < 1 ? 30 :
    engagementRate < 2 ? 50 :
    engagementRate < 3 ? 70 :
    engagementRate < 5 ? 85 : 100
  ));
  
  // Authenticity match (20%)
  // Higher authenticity score = better match
  const authenticityMatch = influencer.authenticityScore;
  
  // Calculate total match score (weighted average)
  const total = (
    (nicheMatch * 0.3) +
    (audienceMatch * 0.25) +
    (engagementMatch * 0.25) +
    (authenticityMatch * 0.2)
  );
  
  return {
    nicheMatch,
    audienceMatch,
    engagementMatch,
    authenticityMatch,
    total,
  };
}

