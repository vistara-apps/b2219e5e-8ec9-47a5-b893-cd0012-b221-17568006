/**
 * Scoring System for AI Matching Algorithm
 * 
 * This module provides scoring functions for various aspects of the
 * influencer-campaign matching process. Each function calculates a
 * normalized score (0-1) for a specific matching criterion.
 */

/**
 * Calculate audience match score between campaign target and influencer audience
 * @param {Object} targetAudience - Campaign target audience demographics and interests
 * @param {Object} influencerAudience - Influencer's audience demographics and interests
 * @returns {number} - Normalized score (0-1)
 */
function calculateAudienceMatch(targetAudience, influencerAudience) {
  // In a real implementation, this would use more sophisticated algorithms
  // such as cosine similarity between audience vectors
  
  // Calculate demographic match
  const demographicMatch = calculateDemographicMatch(
    targetAudience.demographics,
    influencerAudience.demographics
  );
  
  // Calculate interest match
  const interestMatch = calculateInterestMatch(
    targetAudience.interests,
    influencerAudience.interests
  );
  
  // Calculate location match
  const locationMatch = calculateLocationMatch(
    targetAudience.locations,
    influencerAudience.locations
  );
  
  // Weighted average of different audience factors
  return (
    demographicMatch * 0.4 +
    interestMatch * 0.4 +
    locationMatch * 0.2
  );
}

/**
 * Calculate demographic match score
 * @param {Object} targetDemographics - Target demographics (age, gender, etc.)
 * @param {Object} influencerDemographics - Influencer audience demographics
 * @returns {number} - Normalized score (0-1)
 */
function calculateDemographicMatch(targetDemographics, influencerDemographics) {
  // Simple implementation for MVP
  // In a real implementation, this would use statistical methods
  
  // Age range overlap
  const ageMatch = calculateRangeOverlap(
    targetDemographics.ageRange,
    influencerDemographics.ageRange
  );
  
  // Gender distribution similarity
  const genderMatch = calculateDistributionSimilarity(
    targetDemographics.genderDistribution,
    influencerDemographics.genderDistribution
  );
  
  // Income level match
  const incomeMatch = calculateRangeOverlap(
    targetDemographics.incomeRange,
    influencerDemographics.incomeRange
  );
  
  return (ageMatch + genderMatch + incomeMatch) / 3;
}

/**
 * Calculate interest match score
 * @param {Array} targetInterests - Target audience interests
 * @param {Array} influencerInterests - Influencer audience interests
 * @returns {number} - Normalized score (0-1)
 */
function calculateInterestMatch(targetInterests, influencerInterests) {
  // Calculate Jaccard similarity between interest sets
  const intersection = targetInterests.filter(interest => 
    influencerInterests.includes(interest)
  ).length;
  
  const union = new Set([...targetInterests, ...influencerInterests]).size;
  
  return intersection / union;
}

/**
 * Calculate location match score
 * @param {Array} targetLocations - Target audience locations
 * @param {Array} influencerLocations - Influencer audience locations
 * @returns {number} - Normalized score (0-1)
 */
function calculateLocationMatch(targetLocations, influencerLocations) {
  // Calculate weighted location overlap
  const locationOverlap = targetLocations.reduce((score, location) => {
    const matchingLocation = influencerLocations.find(
      infLocation => infLocation.region === location.region
    );
    
    if (matchingLocation) {
      // Weight by the minimum percentage between target and influencer
      const weight = Math.min(
        location.percentage,
        matchingLocation.percentage
      );
      
      return score + weight;
    }
    
    return score;
  }, 0);
  
  // Normalize to 0-1 range
  return Math.min(1, locationOverlap / 100);
}

/**
 * Calculate engagement score relative to industry averages
 * @param {Object} influencerEngagement - Influencer engagement metrics
 * @param {Object} industryAverages - Industry average engagement metrics
 * @returns {number} - Normalized score (0-1)
 */
function calculateEngagementScore(influencerEngagement, industryAverages) {
  // Calculate relative engagement rate
  const relativeEngagementRate = 
    influencerEngagement.rate / industryAverages.engagementRate;
  
  // Calculate comment-to-like ratio quality
  const commentRatioQuality = 
    influencerEngagement.commentRatio / industryAverages.commentRatio;
  
  // Calculate share rate quality
  const shareRateQuality = 
    influencerEngagement.shareRate / industryAverages.shareRate;
  
  // Calculate weighted engagement score
  const weightedScore = 
    relativeEngagementRate * 0.5 +
    commentRatioQuality * 0.3 +
    shareRateQuality * 0.2;
  
  // Normalize to 0-1 range with diminishing returns for extremely high values
  return Math.min(1, Math.log10(1 + weightedScore) / Math.log10(3));
}

/**
 * Calculate content quality score
 * @param {Array} contentSamples - Influencer content samples
 * @param {Object} contentRequirements - Campaign content requirements
 * @returns {number} - Normalized score (0-1)
 */
function calculateContentQuality(contentSamples, contentRequirements) {
  // In a real implementation, this would use computer vision and NLP
  // to analyze content quality, style, and relevance
  
  // For MVP, we'll use a simplified scoring approach
  const relevanceScore = 0.85; // Placeholder
  const qualityScore = 0.78;   // Placeholder
  const styleMatch = 0.92;     // Placeholder
  
  return (
    relevanceScore * 0.4 +
    qualityScore * 0.3 +
    styleMatch * 0.3
  );
}

/**
 * Calculate authenticity score
 * @param {Object} authenticityMetrics - Influencer authenticity metrics
 * @returns {number} - Normalized score (0-1)
 */
function calculateAuthenticity(authenticityMetrics) {
  // Factors that contribute to authenticity
  const growthPatternScore = authenticityMetrics.naturalGrowthPattern ? 1 : 0.3;
  const engagementConsistencyScore = authenticityMetrics.engagementConsistency;
  const audienceQualityScore = authenticityMetrics.audienceQuality;
  const contentAuthenticityScore = authenticityMetrics.contentAuthenticity;
  
  // Weighted authenticity score
  return (
    growthPatternScore * 0.3 +
    engagementConsistencyScore * 0.3 +
    audienceQualityScore * 0.2 +
    contentAuthenticityScore * 0.2
  );
}

/**
 * Calculate price match score
 * @param {Object} influencerPricing - Influencer pricing information
 * @param {Object} campaignBudget - Campaign budget information
 * @returns {number} - Normalized score (0-1)
 */
function calculatePriceMatch(influencerPricing, campaignBudget) {
  // Calculate price-to-budget ratio
  const priceRatio = influencerPricing.postPrice / campaignBudget.perInfluencer;
  
  // Perfect match if price is exactly at budget
  if (priceRatio === 1) return 1;
  
  // If price is below budget, score based on how close it is to budget
  if (priceRatio < 1) {
    return 0.7 + (priceRatio * 0.3);
  }
  
  // If price is above budget, score decreases as price increases
  const overBudgetPenalty = Math.min(1, (priceRatio - 1) * 2);
  return Math.max(0, 1 - overBudgetPenalty);
}

/**
 * Calculate overall match between influencer and campaign
 * @param {Object} influencerFeatures - Processed influencer features
 * @param {Object} campaignFeatures - Processed campaign features
 * @returns {number} - Overall match score (0-1)
 */
function calculateOverallMatch(influencerFeatures, campaignFeatures) {
  // Default weights
  const weights = {
    audienceMatch: 0.35,
    engagementRate: 0.25,
    contentQuality: 0.15,
    authenticity: 0.15,
    priceMatch: 0.10
  };
  
  // Calculate individual scores
  const audienceMatchScore = calculateAudienceMatch(
    campaignFeatures.targetAudience,
    influencerFeatures.audience
  );
  
  const engagementScore = calculateEngagementScore(
    influencerFeatures.engagement,
    campaignFeatures.industryAverages.engagement
  );
  
  const contentQualityScore = calculateContentQuality(
    influencerFeatures.contentSamples,
    campaignFeatures.contentRequirements
  );
  
  const authenticityScore = calculateAuthenticity(
    influencerFeatures.authenticity
  );
  
  const priceMatchScore = calculatePriceMatch(
    influencerFeatures.pricing,
    campaignFeatures.budget
  );
  
  // Calculate weighted total score
  return (
    audienceMatchScore * weights.audienceMatch +
    engagementScore * weights.engagementRate +
    contentQualityScore * weights.contentQuality +
    authenticityScore * weights.authenticity +
    priceMatchScore * weights.priceMatch
  );
}

/**
 * Analyze campaign performance
 * @param {Object} campaign - Campaign data with performance metrics
 * @returns {Object} - Performance analysis
 */
function analyzeCampaignPerformance(campaign) {
  // Placeholder implementation
  return {
    overallPerformance: 0.78,
    averagePerformance: 0.75,
    segments: [
      { name: 'Fashion', performance: 0.82 },
      { name: 'Beauty', performance: 0.79 },
      { name: 'Lifestyle', performance: 0.65 }
    ]
  };
}

/**
 * Optimize budget allocation based on performance
 * @param {Object} campaign - Campaign data
 * @param {Array} matches - Current influencer matches
 * @returns {Object} - Budget optimization suggestions
 */
function optimizeBudgetAllocation(campaign, matches) {
  // Placeholder implementation
  return {
    reallocation: [
      { segment: 'Fashion', currentBudget: 5000, suggestedBudget: 6000 },
      { segment: 'Beauty', currentBudget: 3000, suggestedBudget: 3500 },
      { segment: 'Lifestyle', currentBudget: 2000, suggestedBudget: 500 }
    ]
  };
}

/**
 * Suggest content improvements
 * @param {Object} campaign - Campaign data
 * @param {Array} matches - Current influencer matches
 * @returns {Object} - Content improvement suggestions
 */
function suggestContentImprovements(campaign, matches) {
  // Placeholder implementation
  return {
    suggestions: [
      'Increase video content for higher engagement',
      'Add more product demonstration posts',
      'Include user testimonials in content'
    ]
  };
}

/**
 * Recommend additional influencers
 * @param {Object} campaign - Campaign data
 * @param {Array} matches - Current influencer matches
 * @param {Array} underperformingSegments - Underperforming audience segments
 * @returns {Object} - Influencer recommendations
 */
function recommendAdditionalInfluencers(campaign, matches, underperformingSegments) {
  // Placeholder implementation
  return {
    recommendations: [
      { id: 'inf123', name: 'John Doe', segment: 'Lifestyle', score: 0.92 },
      { id: 'inf456', name: 'Jane Smith', segment: 'Beauty', score: 0.89 }
    ]
  };
}

/**
 * Optimize posting schedule
 * @param {Object} campaign - Campaign data
 * @param {Array} matches - Current influencer matches
 * @returns {Object} - Schedule optimization suggestions
 */
function optimizePostingSchedule(campaign, matches) {
  // Placeholder implementation
  return {
    bestDays: ['Wednesday', 'Thursday'],
    bestTimes: ['10:00 AM', '7:00 PM'],
    staggeredSchedule: [
      { influencer: 'inf123', suggestedTime: '2023-06-15T10:00:00Z' },
      { influencer: 'inf456', suggestedTime: '2023-06-16T19:00:00Z' }
    ]
  };
}

/**
 * Calculate overlap between two ranges
 * @param {Array} range1 - First range [min, max]
 * @param {Array} range2 - Second range [min, max]
 * @returns {number} - Normalized overlap (0-1)
 */
function calculateRangeOverlap(range1, range2) {
  const [min1, max1] = range1;
  const [min2, max2] = range2;
  
  // Calculate overlap
  const overlapStart = Math.max(min1, min2);
  const overlapEnd = Math.min(max1, max2);
  
  if (overlapStart > overlapEnd) {
    return 0; // No overlap
  }
  
  // Calculate overlap percentage relative to the target range
  const overlapLength = overlapEnd - overlapStart;
  const range1Length = max1 - min1;
  
  return overlapLength / range1Length;
}

/**
 * Calculate similarity between two distributions
 * @param {Object} dist1 - First distribution (e.g., {male: 0.4, female: 0.6})
 * @param {Object} dist2 - Second distribution
 * @returns {number} - Normalized similarity (0-1)
 */
function calculateDistributionSimilarity(dist1, dist2) {
  // Get all categories
  const allCategories = [...new Set([
    ...Object.keys(dist1),
    ...Object.keys(dist2)
  ])];
  
  // Calculate Manhattan distance (L1 norm)
  const distance = allCategories.reduce((sum, category) => {
    const value1 = dist1[category] || 0;
    const value2 = dist2[category] || 0;
    return sum + Math.abs(value1 - value2);
  }, 0);
  
  // Convert distance to similarity (0-1)
  // Maximum possible distance is 2 (completely different distributions)
  return 1 - (distance / 2);
}

export const scoringSystem = {
  calculateAudienceMatch,
  calculateEngagementScore,
  calculateContentQuality,
  calculateAuthenticity,
  calculatePriceMatch,
  calculateOverallMatch,
  analyzeCampaignPerformance,
  optimizeBudgetAllocation,
  suggestContentImprovements,
  recommendAdditionalInfluencers,
  optimizePostingSchedule
};

