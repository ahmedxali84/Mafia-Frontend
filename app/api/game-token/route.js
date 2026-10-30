import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authEnabled, authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const LIFETIME = 12 * 60 * 60; // seconds; the browser asks for a fresh one well before that
const b64 = (v) => Buffer.from(JSON.stringify(v)).toString('base64url');

// HS256 token the game server checks (mafia-backend auth.js). GAME_TOKEN_SECRET must be the same
// value on Vercel and on Render.
function sign(claims, secret) {
  const data = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(claims)}`;
  return `${data}.${crypto.createHmac('sha256', secret).update(data).digest('base64url')}`;
}

// { enabled, user: { name, image } | null, token } for the browser. Never cached.
export async function GET() {
  const headers = { 'cache-control': 'no-store' };
  if (!authEnabled) return Response.json({ enabled: false, user: null, token: null }, { headers });
  const session = await getServerSession(authOptions);
  const u = session?.user;
  if (!u?.id) return Response.json({ enabled: true, user: null, token: null }, { headers });
  const secret = process.env.GAME_TOKEN_SECRET;
  const token = secret ? sign({ sub: u.id, name: u.name || '', picture: u.image || '', exp: Math.floor(Date.now() / 1000) + LIFETIME }, secret) : null;
  return Response.json({ enabled: true, user: { name: u.name || '', image: u.image || null }, token }, { headers });
}
