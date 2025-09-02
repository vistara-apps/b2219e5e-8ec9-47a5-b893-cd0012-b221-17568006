# InfluencerMatch API Documentation

This document provides comprehensive documentation for the InfluencerMatch API, which powers the AI-driven micro-influencer matching and campaign management platform.

## Base URL

All API endpoints are relative to the base URL:

```
https://api.influencermatch.com/v1
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

To obtain an access token, use the authentication endpoints described below.

## Error Handling

The API returns standard HTTP status codes to indicate success or failure:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate entry)
- `500 Internal Server Error`: Server error

Error responses include a JSON object with details:

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid parameter: budget must be a positive number",
    "details": {
      "field": "budget",
      "constraint": "positive_number"
    }
  }
}
```

## Rate Limiting

API requests are rate-limited to 100 requests per minute per API key. Rate limit information is included in the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

## Endpoints

### Authentication

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "BUSINESS" // or "INFLUENCER"
}
```

**Response:**

```json
{
  "id": "user_123456",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "BUSINESS",
  "createdAt": "2023-06-01T12:00:00Z"
}
```

#### POST /auth/login

Authenticate a user and get an access token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "user_123456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BUSINESS"
  }
}
```

#### POST /auth/refresh

Refresh an expired access token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### User Management

#### GET /users/me

Get the current user's profile.

**Response:**

```json
{
  "id": "user_123456",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "BUSINESS",
  "createdAt": "2023-06-01T12:00:00Z",
  "business": {
    "id": "business_123456",
    "companyName": "Acme Inc.",
    "website": "https://acme.com",
    "industry": "Technology"
  }
}
```

#### PUT /users/me

Update the current user's profile.

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response:**

```json
{
  "id": "user_123456",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "BUSINESS",
  "updatedAt": "2023-06-02T12:00:00Z"
}
```

### Business Profiles

#### GET /business

Get the current business profile.

**Response:**

```json
{
  "id": "business_123456",
  "userId": "user_123456",
  "companyName": "Acme Inc.",
  "website": "https://acme.com",
  "industry": "Technology",
  "description": "Leading technology company",
  "logoUrl": "https://example.com/logo.png",
  "createdAt": "2023-06-01T12:00:00Z",
  "updatedAt": "2023-06-01T12:00:00Z"
}
```

#### PUT /business

Update the current business profile.

**Request Body:**

```json
{
  "companyName": "Acme Corporation",
  "website": "https://acmecorp.com",
  "industry": "Software",
  "description": "Leading software company",
  "logoUrl": "https://example.com/new-logo.png"
}
```

**Response:**

```json
{
  "id": "business_123456",
  "userId": "user_123456",
  "companyName": "Acme Corporation",
  "website": "https://acmecorp.com",
  "industry": "Software",
  "description": "Leading software company",
  "logoUrl": "https://example.com/new-logo.png",
  "updatedAt": "2023-06-02T12:00:00Z"
}
```

### Influencer Profiles

#### GET /influencer

Get the current influencer profile.

**Response:**

```json
{
  "id": "influencer_123456",
  "userId": "user_123456",
  "bio": "Fashion and lifestyle content creator",
  "niche": ["Fashion", "Lifestyle"],
  "followers": 15000,
  "engagement": 0.05,
  "authenticity": 0.92,
  "socialAccounts": [
    {
      "id": "social_123456",
      "platform": "Instagram",
      "username": "@fashionista",
      "url": "https://instagram.com/fashionista",
      "followers": 12000,
      "engagement": 0.06,
      "verified": true
    }
  ],
  "createdAt": "2023-06-01T12:00:00Z",
  "updatedAt": "2023-06-01T12:00:00Z"
}
```

#### PUT /influencer

Update the current influencer profile.

**Request Body:**

```json
{
  "bio": "Fashion, lifestyle, and travel content creator",
  "niche": ["Fashion", "Lifestyle", "Travel"]
}
```

**Response:**

```json
{
  "id": "influencer_123456",
  "userId": "user_123456",
  "bio": "Fashion, lifestyle, and travel content creator",
  "niche": ["Fashion", "Lifestyle", "Travel"],
  "followers": 15000,
  "engagement": 0.05,
  "authenticity": 0.92,
  "updatedAt": "2023-06-02T12:00:00Z"
}
```

#### POST /influencer/social-accounts

Add a social media account to the influencer profile.

**Request Body:**

```json
{
  "platform": "TikTok",
  "username": "@fashionista",
  "url": "https://tiktok.com/@fashionista"
}
```

**Response:**

```json
{
  "id": "social_789012",
  "influencerId": "influencer_123456",
  "platform": "TikTok",
  "username": "@fashionista",
  "url": "https://tiktok.com/@fashionista",
  "followers": 0,
  "engagement": 0,
  "verified": false,
  "createdAt": "2023-06-02T12:00:00Z"
}
```

#### PUT /influencer/social-accounts/{id}

Update a social media account.

**Request Body:**

```json
{
  "username": "@fashion_creator",
  "url": "https://tiktok.com/@fashion_creator"
}
```

**Response:**

```json
{
  "id": "social_789012",
  "influencerId": "influencer_123456",
  "platform": "TikTok",
  "username": "@fashion_creator",
  "url": "https://tiktok.com/@fashion_creator",
  "followers": 0,
  "engagement": 0,
  "verified": false,
  "updatedAt": "2023-06-02T13:00:00Z"
}
```

#### DELETE /influencer/social-accounts/{id}

Delete a social media account.

**Response:**

```
204 No Content
```

### Campaigns

#### GET /campaigns

Get all campaigns for the current business.

**Query Parameters:**

- `status` (optional): Filter by status (DRAFT, ACTIVE, PAUSED, COMPLETED, CANCELLED)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "data": [
    {
      "id": "campaign_123456",
      "businessId": "business_123456",
      "title": "Summer Product Launch",
      "description": "Promote our new summer collection",
      "goals": ["awareness", "conversion"],
      "targetAudience": {
        "ageRange": [18, 34],
        "genderDistribution": {
          "male": 40,
          "female": 60,
          "other": 0
        },
        "locations": ["United States", "Canada"],
        "interests": ["Fashion", "Beauty"]
      },
      "budget": 5000,
      "startDate": "2023-06-15T00:00:00Z",
      "endDate": "2023-07-15T00:00:00Z",
      "status": "ACTIVE",
      "requirements": "Looking for authentic content showcasing our products",
      "createdAt": "2023-06-01T12:00:00Z",
      "updatedAt": "2023-06-01T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

#### POST /campaigns

Create a new campaign.

**Request Body:**

```json
{
  "title": "Summer Product Launch",
  "description": "Promote our new summer collection",
  "goals": ["awareness", "conversion"],
  "targetAudience": {
    "ageRange": [18, 34],
    "genderDistribution": {
      "male": 40,
      "female": 60,
      "other": 0
    },
    "locations": ["United States", "Canada"],
    "interests": ["Fashion", "Beauty"]
  },
  "budget": 5000,
  "startDate": "2023-06-15T00:00:00Z",
  "endDate": "2023-07-15T00:00:00Z",
  "requirements": "Looking for authentic content showcasing our products"
}
```

**Response:**

```json
{
  "id": "campaign_123456",
  "businessId": "business_123456",
  "title": "Summer Product Launch",
  "description": "Promote our new summer collection",
  "goals": ["awareness", "conversion"],
  "targetAudience": {
    "ageRange": [18, 34],
    "genderDistribution": {
      "male": 40,
      "female": 60,
      "other": 0
    },
    "locations": ["United States", "Canada"],
    "interests": ["Fashion", "Beauty"]
  },
  "budget": 5000,
  "startDate": "2023-06-15T00:00:00Z",
  "endDate": "2023-07-15T00:00:00Z",
  "status": "DRAFT",
  "requirements": "Looking for authentic content showcasing our products",
  "createdAt": "2023-06-02T12:00:00Z",
  "updatedAt": "2023-06-02T12:00:00Z"
}
```

#### GET /campaigns/{id}

Get a specific campaign.

**Response:**

```json
{
  "id": "campaign_123456",
  "businessId": "business_123456",
  "title": "Summer Product Launch",
  "description": "Promote our new summer collection",
  "goals": ["awareness", "conversion"],
  "targetAudience": {
    "ageRange": [18, 34],
    "genderDistribution": {
      "male": 40,
      "female": 60,
      "other": 0
    },
    "locations": ["United States", "Canada"],
    "interests": ["Fashion", "Beauty"]
  },
  "budget": 5000,
  "startDate": "2023-06-15T00:00:00Z",
  "endDate": "2023-07-15T00:00:00Z",
  "status": "ACTIVE",
  "requirements": "Looking for authentic content showcasing our products",
  "createdAt": "2023-06-01T12:00:00Z",
  "updatedAt": "2023-06-01T12:00:00Z"
}
```

#### PUT /campaigns/{id}

Update a campaign.

**Request Body:**

```json
{
  "title": "Updated Summer Product Launch",
  "budget": 6000,
  "status": "ACTIVE"
}
```

**Response:**

```json
{
  "id": "campaign_123456",
  "businessId": "business_123456",
  "title": "Updated Summer Product Launch",
  "description": "Promote our new summer collection",
  "goals": ["awareness", "conversion"],
  "targetAudience": {
    "ageRange": [18, 34],
    "genderDistribution": {
      "male": 40,
      "female": 60,
      "other": 0
    },
    "locations": ["United States", "Canada"],
    "interests": ["Fashion", "Beauty"]
  },
  "budget": 6000,
  "startDate": "2023-06-15T00:00:00Z",
  "endDate": "2023-07-15T00:00:00Z",
  "status": "ACTIVE",
  "requirements": "Looking for authentic content showcasing our products",
  "updatedAt": "2023-06-02T13:00:00Z"
}
```

#### DELETE /campaigns/{id}

Delete a campaign.

**Response:**

```
204 No Content
```

### AI Matching

#### POST /ai/match

Run the AI matching algorithm to find suitable influencers for a campaign.

**Request Body:**

```json
{
  "campaignId": "campaign_123456",
  "options": {
    "weights": {
      "audienceMatch": 0.4,
      "engagementRate": 0.3,
      "contentQuality": 0.1,
      "authenticity": 0.1,
      "priceMatch": 0.1
    }
  }
}
```

**Response:**

```json
{
  "matches": [
    {
      "influencerId": "influencer_789012",
      "campaignId": "campaign_123456",
      "totalScore": 0.92,
      "details": {
        "audienceMatch": 0.95,
        "engagement": 0.88,
        "contentQuality": 0.90,
        "authenticity": 0.95,
        "priceMatch": 0.85
      },
      "influencer": {
        "id": "influencer_789012",
        "name": "Alice Johnson",
        "followers": 15000,
        "engagement": 0.05,
        "niche": ["Fashion", "Lifestyle"]
      }
    },
    {
      "influencerId": "influencer_345678",
      "campaignId": "campaign_123456",
      "totalScore": 0.88,
      "details": {
        "audienceMatch": 0.90,
        "engagement": 0.85,
        "contentQuality": 0.88,
        "authenticity": 0.92,
        "priceMatch": 0.80
      },
      "influencer": {
        "id": "influencer_345678",
        "name": "Bob Smith",
        "followers": 25000,
        "engagement": 0.04,
        "niche": ["Fashion", "Travel"]
      }
    }
  ]
}
```

#### GET /ai/match

Get existing matches for a campaign.

**Query Parameters:**

- `campaignId` (required): Campaign ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "matches": [
    {
      "id": "match_123456",
      "influencerId": "influencer_789012",
      "campaignId": "campaign_123456",
      "status": "PENDING",
      "score": 0.92,
      "influencer": {
        "id": "influencer_789012",
        "name": "Alice Johnson",
        "image": "https://example.com/alice.jpg",
        "followers": 15000,
        "engagement": 0.05,
        "niche": ["Fashion", "Lifestyle"],
        "socialAccounts": [
          {
            "platform": "Instagram",
            "username": "@alice_style"
          }
        ]
      }
    }
  ]
}
```

#### GET /ai/recommend

Get campaign recommendations for an influencer.

**Query Parameters:**

- `influencerId` (required): Influencer ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "recommendations": [
    {
      "campaignId": "campaign_123456",
      "score": 0.92,
      "campaign": {
        "id": "campaign_123456",
        "title": "Summer Product Launch",
        "budget": 5000,
        "startDate": "2023-06-15T00:00:00Z",
        "endDate": "2023-07-15T00:00:00Z",
        "business": {
          "id": "business_123456",
          "name": "Acme Inc.",
          "image": "https://example.com/logo.png"
        }
      }
    }
  ]
}
```

### Campaign Matches

#### PUT /campaigns/{campaignId}/matches/{matchId}

Update the status of a campaign match.

**Request Body:**

```json
{
  "status": "ACCEPTED" // or "REJECTED", "COMPLETED"
}
```

**Response:**

```json
{
  "id": "match_123456",
  "influencerId": "influencer_789012",
  "campaignId": "campaign_123456",
  "status": "ACCEPTED",
  "score": 0.92,
  "updatedAt": "2023-06-02T14:00:00Z"
}
```

#### POST /campaigns/{campaignId}/matches/{matchId}/offer

Make an offer to an influencer.

**Request Body:**

```json
{
  "amount": 500,
  "brief": "We would like you to create 3 Instagram posts showcasing our products in real-life settings."
}
```

**Response:**

```json
{
  "id": "match_123456",
  "influencerId": "influencer_789012",
  "campaignId": "campaign_123456",
  "status": "PENDING",
  "score": 0.92,
  "offer": 500,
  "brief": "We would like you to create 3 Instagram posts showcasing our products in real-life settings.",
  "updatedAt": "2023-06-02T14:00:00Z"
}
```

### Messages

#### GET /messages

Get messages for the current user.

**Query Parameters:**

- `campaignMatchId` (required): Campaign match ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**

```json
{
  "data": [
    {
      "id": "message_123456",
      "campaignMatchId": "match_123456",
      "senderId": "user_123456",
      "content": "Hi, I'm interested in working with you on this campaign.",
      "read": true,
      "createdAt": "2023-06-02T12:00:00Z"
    },
    {
      "id": "message_789012",
      "campaignMatchId": "match_123456",
      "senderId": "user_789012",
      "content": "Great! Let's discuss the details.",
      "read": false,
      "createdAt": "2023-06-02T12:05:00Z"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

#### POST /messages

Send a message.

**Request Body:**

```json
{
  "campaignMatchId": "match_123456",
  "content": "When would you like to start the campaign?"
}
```

**Response:**

```json
{
  "id": "message_345678",
  "campaignMatchId": "match_123456",
  "senderId": "user_123456",
  "content": "When would you like to start the campaign?",
  "read": false,
  "createdAt": "2023-06-02T12:10:00Z"
}
```

#### PUT /messages/{id}/read

Mark a message as read.

**Response:**

```json
{
  "id": "message_789012",
  "campaignMatchId": "match_123456",
  "senderId": "user_789012",
  "content": "Great! Let's discuss the details.",
  "read": true,
  "updatedAt": "2023-06-02T12:15:00Z"
}
```

### Analytics

#### GET /analytics/campaigns/{id}

Get analytics for a specific campaign.

**Query Parameters:**

- `timeframe` (optional): Time period (day, week, month, quarter, year, all)
- `startDate` (optional): Start date for custom timeframe
- `endDate` (optional): End date for custom timeframe

**Response:**

```json
{
  "campaign": {
    "id": "campaign_123456",
    "title": "Summer Product Launch"
  },
  "metrics": {
    "impressions": 25000,
    "engagement": 1500,
    "clicks": 800,
    "conversions": 200,
    "roi": 2.5
  },
  "influencers": [
    {
      "id": "influencer_789012",
      "name": "Alice Johnson",
      "metrics": {
        "impressions": 15000,
        "engagement": 900,
        "clicks": 500,
        "conversions": 120,
        "roi": 2.8
      }
    }
  ],
  "trends": {
    "daily": [
      {
        "date": "2023-06-15",
        "impressions": 2500,
        "engagement": 150,
        "clicks": 80,
        "conversions": 20
      }
    ]
  },
  "demographics": {
    "age": [
      {
        "group": "18-24",
        "percentage": 35
      },
      {
        "group": "25-34",
        "percentage": 45
      }
    ],
    "gender": [
      {
        "group": "Male",
        "percentage": 40
      },
      {
        "group": "Female",
        "percentage": 58
      },
      {
        "group": "Other",
        "percentage": 2
      }
    ],
    "location": [
      {
        "group": "United States",
        "percentage": 70
      },
      {
        "group": "Canada",
        "percentage": 20
      }
    ]
  }
}
```

#### GET /analytics/influencer

Get analytics for the current influencer.

**Query Parameters:**

- `timeframe` (optional): Time period (day, week, month, quarter, year, all)
- `startDate` (optional): Start date for custom timeframe
- `endDate` (optional): End date for custom timeframe

**Response:**

```json
{
  "influencer": {
    "id": "influencer_789012",
    "name": "Alice Johnson"
  },
  "metrics": {
    "impressions": 50000,
    "engagement": 3000,
    "clicks": 1500,
    "conversions": 400,
    "earnings": 2500
  },
  "campaigns": [
    {
      "id": "campaign_123456",
      "title": "Summer Product Launch",
      "metrics": {
        "impressions": 15000,
        "engagement": 900,
        "clicks": 500,
        "conversions": 120,
        "earnings": 800
      }
    }
  ],
  "trends": {
    "monthly": [
      {
        "date": "2023-06",
        "impressions": 25000,
        "engagement": 1500,
        "earnings": 1200
      }
    ]
  },
  "audience": {
    "age": [
      {
        "group": "18-24",
        "percentage": 35
      },
      {
        "group": "25-34",
        "percentage": 45
      }
    ],
    "gender": [
      {
        "group": "Male",
        "percentage": 40
      },
      {
        "group": "Female",
        "percentage": 58
      },
      {
        "group": "Other",
        "percentage": 2
      }
    ],
    "location": [
      {
        "group": "United States",
        "percentage": 70
      },
      {
        "group": "Canada",
        "percentage": 20
      }
    ]
  }
}
```

## Webhooks

The API supports webhooks for real-time event notifications. You can configure webhooks in your account settings.

### Webhook Events

- `campaign.created`: A new campaign is created
- `campaign.updated`: A campaign is updated
- `campaign.deleted`: A campaign is deleted
- `match.created`: A new match is created
- `match.updated`: A match status is updated
- `message.created`: A new message is sent
- `payment.succeeded`: A payment is successful
- `payment.failed`: A payment fails

### Webhook Payload

```json
{
  "event": "match.updated",
  "timestamp": "2023-06-02T14:00:00Z",
  "data": {
    "id": "match_123456",
    "influencerId": "influencer_789012",
    "campaignId": "campaign_123456",
    "status": "ACCEPTED",
    "updatedAt": "2023-06-02T14:00:00Z"
  }
}
```

## SDKs and Client Libraries

We provide official client libraries for several programming languages:

- [JavaScript/TypeScript](https://github.com/influencermatch/influencermatch-js)
- [Python](https://github.com/influencermatch/influencermatch-python)
- [Ruby](https://github.com/influencermatch/influencermatch-ruby)
- [PHP](https://github.com/influencermatch/influencermatch-php)
- [Java](https://github.com/influencermatch/influencermatch-java)
- [Go](https://github.com/influencermatch/influencermatch-go)

## Support

If you have any questions or need assistance, please contact our support team at api-support@influencermatch.com or visit our [Developer Forum](https://developers.influencermatch.com/forum).

