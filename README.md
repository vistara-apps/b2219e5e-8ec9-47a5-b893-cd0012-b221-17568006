# InfluencerMatch - AI-Powered Micro-Influencer Platform

InfluencerMatch is an AI-powered platform that connects businesses with pre-vetted micro-influencers and provides intuitive tools for campaign management.

## Features

- **AI Micro-Influencer Matching**: Automatically match businesses with micro-influencers based on campaign goals, target audience demographics, niche relevance, and past performance data.
- **Audience Authenticity Verification**: Analyze influencer follower counts and engagement metrics, flagging potential bots, fake followers, or inflated engagement rates.
- **Intuitive Campaign Workflow Automation**: Streamlined solution for briefing influencers, managing content approvals, and processing payments.
- **Performance Analytics Dashboard**: Visualize campaign metrics, influencer ROI, and overall success in an easy-to-understand format.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Blockchain Integration**: Base Wallet via OnchainKit

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- Base Wallet for authentication (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/influencer-match.git
   cd influencer-match
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your database connection string and other configuration.

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js app directory with pages and components
- `/app/api`: API routes for backend functionality
- `/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations

## API Documentation

### Authentication

- `POST /api/auth/[...nextauth]`: NextAuth.js authentication endpoints
- `POST /api/auth/wallet`: Authenticate or register with wallet

### Users

- `GET /api/users`: Get all users
- `POST /api/users`: Create a new user
- `GET /api/users/[id]`: Get user by ID
- `PUT /api/users/[id]`: Update user
- `DELETE /api/users/[id]`: Delete user

### Campaigns

- `GET /api/campaigns`: Get all campaigns
- `POST /api/campaigns`: Create a new campaign
- `GET /api/campaigns/[id]`: Get campaign by ID
- `PUT /api/campaigns/[id]`: Update campaign
- `DELETE /api/campaigns/[id]`: Delete campaign
- `POST /api/campaigns/[id]/content`: Submit content for a campaign
- `POST /api/campaigns/[id]/content/review`: Review content for a campaign

### Influencers

- `GET /api/influencers`: Get all influencers
- `GET /api/influencers/[id]/campaigns`: Get campaigns for an influencer

### Matching

- `GET /api/matching`: Get matching influencers for a campaign
- `POST /api/matching/assign`: Assign influencers to a campaign

### Analytics

- `GET /api/analytics`: Get analytics data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OnchainKit](https://onchainkit.xyz/)
- [Base](https://base.org/)

