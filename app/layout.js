import { Barlow_Condensed, Cinzel, Inter } from 'next/font/google';
import './globals.css';
import './game.css';
import './cards.css';
import ClickSounds from '@/components/ClickSounds';
import KeyboardResize from '@/components/KeyboardResize';

const display = Cinzel({ subsets: ['latin'], weight: ['600', '800'], variable: '--font-display' });
const hud = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-hud' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  title: 'Mafia — play with friends',
  description: 'A real-time multiplayer Mafia game. Hidden roles, night kills, day votes. No download needed.',
  openGraph: { title: 'Mafia', description: 'Play Mafia with friends in your browser.' },
};

// The keyboard setting (interactive-widget) is added by <KeyboardResize />, so Safari never sees it.
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#070405' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${hud.variable} ${body.variable}`}>
      <body>
        <ClickSounds />
        <KeyboardResize />
        {children}
      </body>
    </html>
  );
}
