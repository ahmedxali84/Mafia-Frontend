import NextAuth from 'next-auth';
import { authEnabled, authOptions } from '@/lib/auth';

const off = () => new Response('Accounts are not set up', { status: 404 });
const handler = authEnabled ? NextAuth(authOptions) : off;

export { handler as GET, handler as POST };
