'use client';
import { useEffect, useState } from 'react';
import { SERVER_URL } from './socket';

// The signed-in account (Google login), shared by the menu, the career page and the socket.
// `account`: { enabled, user: { name, image } | null, token } from /api/game-token.
const MAX_AGE = 60 * 60 * 1000; // re-fetch the game token after an hour
let cached = null;
let fetchedAt = 0;
let pending = null;

export async function loadAccount(force = false) {
  if (!force && cached && Date.now() - fetchedAt < MAX_AGE) return cached;
  pending ||= fetch('/api/game-token', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then((a) => {
      cached = { enabled: !!a.enabled, user: a.user || null, token: a.token || null };
      fetchedAt = Date.now();
      return cached;
    })
    // Couldn't ask (offline, server hiccup): don't cache it; `failed` tells authToken() to stay quiet.
    .catch(() => ({ ...(cached || { enabled: false, user: null, token: null }), failed: true }))
    .finally(() => (pending = null));
  return pending;
}

// The token to send with create_room / join_room: a token, null (signed out: play as a guest), or
// undefined when we couldn't check, which the server reads as "keep this seat's account".
export async function authToken() {
  const a = await loadAccount();
  return a.failed ? undefined : a.token;
}

export function useAccount() {
  const [account, setAccount] = useState(cached);
  useEffect(() => {
    let live = true;
    loadAccount().then((a) => live && setAccount(a));
    return () => { live = false; };
  }, []);
  return account;
}

// Stats saved on the game server for the signed-in player, or null (guest / accounts off / offline).
export async function fetchServerStats() {
  const { token } = await loadAccount();
  if (!token) return null;
  try {
    const r = await fetch(`${SERVER_URL}/stats/me`, { headers: { authorization: `Bearer ${token}` }, cache: 'no-store' });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}
