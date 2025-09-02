/**
 * Calculate a match score between an influencer and a campaign
 * @param {Object} influencer - The influencer object
 * @param {Object} campaign - The campaign object
 * @param {Array} keywords - Keywords extracted from the campaign
 * @returns {Object} - Score breakdown and total
 */
export function calculateMatchScore(influencer, campaign, keywords) {
  // Calculate niche relevance score (0-40 points)
  const nicheRelevance = calculateNicheRelevance(influencer, keywords);
  
  // Calculate audience match score (0-30 points)
  const audienceMatch = calculateAudienceMatch(influencer, campaign);
  
  // Calculate performance score based on engagement rate and followers (0-20 points)
  const performanceScore = calculatePerformanceScore(influencer);
  
  // Use authenticity score (0-10 points)
  const authenticityScore = influencer.authenticityScore / 10;
  
  // Calculate total score (0-100)
  const total = nicheRelevance + audienceMatch + performanceScore + authenticityScore;
  
  return {
    nicheRelevance,
    audienceMatch,
    performanceScore,
    authenticityScore,
    total,
  };
}

/**
 * Calculate how relevant the influencer's niche is to the campaign
 * @param {Object} influencer - The influencer object
 * @param {Array} keywords - Keywords extracted from the campaign
 * @returns {number} - Score between 0-40
 */
function calculateNicheRelevance(influencer, keywords) {
  const niche = influencer.niche.toLowerCase();
  
  // Count how many keywords match the influencer's niche
  let matchCount = 0;
  keywords.forEach(keyword => {
    if (niche.includes(keyword)) {
      matchCount++;
    }
  });
  
  // Calculate score based on percentage of matching keywords
  const matchPercentage = matchCount / keywords.length;
  
  // Scale to 0-40 points
  return Math.round(matchPercentage * 40);
}

/**
 * Calculate how well the influencer's audience matches the campaign's target audience
 * @param {Object} influencer - The influencer object
 * @param {Object} campaign - The campaign object
 * @returns {number} - Score between 0-30
 */
function calculateAudienceMatch(influencer, campaign) {
  // In a real implementation, this would use demographic data
  // For this MVP, we'll use a simplified approach based on platform and followers
  
  const targetAudience = campaign.targetAudience.toLowerCase();
  const platform = influencer.platform.toLowerCase();
  
  // Check if the platform is mentioned in the target audience
  const platformMatch = targetAudience.includes(platform) ? 15 : 0;
  
  // Calculate audience size match (0-15 points)
  // Assuming campaigns have an ideal audience size range
  const followers = influencer.followers;
  let audienceSizeScore = 0;
  
  if (followers < 1000) {
    // Micro-influencer (less than 1K)
    audienceSizeScore = 5;
  } else if (followers < 10000) {
    // Small influencer (1K-10K)
    audienceSizeScore = 10;
  } else if (followers < 100000) {
    // Medium influencer (10K-100K)
    audienceSizeScore = 15;
  } else {
    // Large influencer (100K+)
    audienceSizeScore = 8; // Penalize slightly as they may be too expensive
  }
  
  return platformMatch + audienceSizeScore;
}

/**
 * Calculate performance score based on engagement rate and followers
 * @param {Object} influencer - The influencer object
 * @returns {number} - Score between 0-20
 */
function calculatePerformanceScore(influencer) {
  const { engagementRate, followers } = influencer;
  
  // Calculate engagement score (0-15 points)
  // Engagement rate is typically between 0.01 (1%) and 0.1 (10%)
  const engagementScore = Math.min(engagementRate * 150, 15);
  
  // Calculate follower score (0-5 points)
  // Logarithmic scale to handle wide range of follower counts
  const followerScore = Math.min(Math.log10(followers) - 1, 5);
  
  return Math.round(engagementScore + followerScore);
}

