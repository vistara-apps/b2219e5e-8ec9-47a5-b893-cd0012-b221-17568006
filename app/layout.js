    import { Providers } from './providers';
    import './globals.css';

    export const metadata = {
      title: 'AI Influencer Matching',
      description: 'AI-powered micro-influencer matching and campaign management.',
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
  