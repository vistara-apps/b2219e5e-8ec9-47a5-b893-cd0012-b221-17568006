import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'InfluencerMatch - AI-powered micro-influencer matching',
  description: 'Connect with the perfect micro-influencers for your brand using our advanced AI matching algorithm. Maximize ROI and reach your target audience effectively.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

