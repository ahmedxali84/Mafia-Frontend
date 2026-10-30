'use client';
import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useAccount } from '@/lib/account';
import Icon from './Icon';

// Google sign-in on the menu (week 7). Hidden entirely while accounts are not set up.
export default function AccountBox() {
  const account = useAccount();
  const [picFailed, setPicFailed] = useState(false);
  if (!account?.enabled) return null;
  const back = () => ({ callbackUrl: window.location.href });

  if (!account.user) {
    return (
      <div className="acct">
        <button type="button" className="b b-block b-google" onClick={() => signIn('google', back())}>
          <GoogleMark /> Sign in with Google
        </button>
        <small className="dim">Save your wins and losses to your account, on any device.</small>
      </div>
    );
  }
  return (
    <div className="acct acct-on">
      {account.user.image && !picFailed
        // eslint-disable-next-line @next/next/no-img-element
        ? <img className="acct-pic" src={account.user.image} alt="" width={32} height={32} referrerPolicy="no-referrer" onError={() => setPicFailed(true)} />
        : <span className="acct-pic"><Icon name="users" /></span>}
      <div className="acct-who">
        <b>{account.user.name || 'Signed in'}</b>
        <small className="dim">{account.token ? 'Stats saved to your account' : 'Signed in (stats saving is off on this server)'}</small>
      </div>
      <button type="button" className="b b-sm b-ghost" onClick={() => signOut(back())}>Sign out</button>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="ic" viewBox="0 0 24 24" width="1.1em" height="1.1em" aria-hidden="true">
      <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2-1.9 3.2-4.7 3.2-8.2z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1a6.6 6.6 0 0 1-6.2-4.6H2.1v2.9A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 9.9L5.8 14z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9A6.6 6.6 0 0 1 12 5.4z" />
    </svg>
  );
}
