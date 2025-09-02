# InfluencerMatch - AI-Powered Micro-Influencer Matching Platform

InfluencerMatch is a comprehensive platform that connects businesses with the perfect micro-influencers for their marketing campaigns using advanced AI matching algorithms.

## Features

- **AI-Powered Matching**: Our sophisticated algorithm matches businesses with influencers based on audience demographics, engagement metrics, content quality, and authenticity.
- **Campaign Management**: Create, manage, and track marketing campaigns from start to finish.
- **Influencer Discovery**: Find the right influencers for your brand based on niche, audience demographics, and performance metrics.
- **Authenticity Verification**: Ensure you're working with genuine influencers who have real engagement.
- **Detailed Analytics**: Track campaign performance with comprehensive analytics, including reach, engagement, conversions, and ROI.
- **Secure Messaging**: Built-in messaging system for direct communication between businesses and influencers.
- **Blockchain Integration**: Secure payments and contract management using blockchain technology.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **State Management**: React Query, Context API
- **Blockchain**: Ethereum, Web3.js
- **AI/ML**: Custom matching algorithm
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/influencermatch.git
   cd influencermatch
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/influencermatch"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Web3
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-project-id"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   # or
   yarn prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
influencermatch/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── campaigns/        # Campaign-related pages
│   ├── influencer/       # Influencer-related pages
│   ├── analytics/        # Analytics pages
│   ├── components/       # Shared React components
│   ├── layout.js         # Root layout
│   ├── page.js           # Home page
│   └── providers.js      # Context providers
├── lib/                  # Utility functions and shared code
│   ├── ai/               # AI matching algorithm
│   ├── prisma.js         # Prisma client
│   └── utils.js          # Utility functions
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── docs/                 # Documentation
│   ├── api.md            # API documentation
│   └── components.md     # Component documentation
├── .env.example          # Example environment variables
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Project documentation
```

## API Documentation

For detailed API documentation, see [docs/api.md](docs/api.md).

## Component Documentation

For detailed component documentation, see [docs/components.md](docs/components.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [React Query](https://tanstack.com/query/latest)
- [Wagmi](https://wagmi.sh/)

