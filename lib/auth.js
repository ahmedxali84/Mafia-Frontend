import GoogleProvider from 'next-auth/providers/google';

// Google login (week 7). Off until all three are set (Vercel > Settings > Environment Variables):
// GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and NEXTAUTH_SECRET. Without them the site works as
// before and everyone plays as a guest.
export const authEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.NEXTAUTH_SECRET);

export const authOptions = {
  providers: authEnabled ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })] : [],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' }, // no database needed for the login itself
  callbacks: {
    // token.sub is the Google account id; keep it on the session for /api/game-token.
    session({ session, token }) {
      if (session.user) session.user.id = token.sub;
      return session;
    },
  },
};
