'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Backdrop from '@/components/Backdrop';
import MenuBar from '@/components/MenuBar';
import Icon from '@/components/Icon';
import PoweredBy from '@/components/PoweredBy';
import RoleIcon from '@/components/RoleIcon';
import { ROLES, rankOf } from '@/lib/roles';
import { getStats, resetStats } from '@/lib/stats';
import { fetchServerStats } from '@/lib/account';

const pct = (w, g) => (g ? Math.round((w / g) * 100) : 0);

function ago(t) {
  const m = Math.round((Date.now() - new Date(t).getTime()) / 60000); // ms timestamp or ISO date (server)
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? 'Yesterday' : `${d} days ago`;
}

export default function Career() {
  const [stats, setStats] = useState(null);
  const [saved, setSaved] = useState(false); // true: these are the account's stats from the server
  const [confirm, setConfirm] = useState(false);
  const confirmTimer = useRef(0);

  // Signed in with Google (and the server has a database): show the account's stats, which follow
  // the player to any device. Otherwise the stats kept in this browser.
  useEffect(() => {
    let live = true;
    setStats(getStats());
    fetchServerStats().then((s) => {
      if (!live || !s) return;
      setStats({ ...s, byRole: s.byRole || {}, recent: s.recent || [] });
      setSaved(true);
    });
    return () => {
      live = false;
      clearTimeout(confirmTimer.current);
    };
  }, []);

  // Two-step reset: the first click arms the button for a few seconds.
  function reset() {
    if (!confirm) {
      setConfirm(true);
      confirmTimer.current = setTimeout(() => setConfirm(false), 3000);
      return;
    }
    clearTimeout(confirmTimer.current);
    resetStats();
    setStats(getStats());
    setConfirm(false);
  }

  const rank = rankOf(stats?.wins);

  return (
    <main className="g">
      <Backdrop />
      <MenuBar active="career" />

      <div className="career">
        <section className="career-head cut">
          <div>
            <span className="label">Career · Rank {rank.level}</span>
            <h1 className="h-xl">{rank.name}</h1>
          </div>
          <div className="xp career-xp">
            <div className="xp-row">
              <span>{rank.next ? `Next: ${rank.next.name}` : 'Highest rank reached'}</span>
              <span>{rank.next ? `${stats?.wins ?? 0} / ${rank.next.wins} wins` : ''}</span>
            </div>
            <div className="bar"><span style={{ transform: `scaleX(${rank.progress})` }} /></div>
          </div>
        </section>

        {!stats ? (
          <div className="panel cut"><p className="dim">Loading…</p></div>
        ) : stats.games === 0 ? (
          <div className="panel cut empty-state">
            <Icon name="trophy" />
            <b>No games on record yet</b>
            <p className="dim">Finish a game and your record shows up here. {saved ? 'They are saved to your account.' : 'Stats are kept in this browser.'}</p>
            <Link className="b b-primary" href="/play"><Icon name="play" /> Play now</Link>
          </div>
        ) : (
          <>
            <dl className="kpis kpis-lg">
              <div className="cut"><dt>Games</dt><dd>{stats.games}</dd></div>
              <div className="cut"><dt>Wins</dt><dd className="t-gold">{stats.wins}</dd></div>
              <div className="cut"><dt>Losses</dt><dd>{stats.losses}</dd></div>
              <div className="cut"><dt>Win rate</dt><dd>{pct(stats.wins, stats.games)}%</dd></div>
            </dl>

            <div className="career-grid">
              <section className="panel cut" aria-labelledby="by-role">
                <h2 id="by-role" className="panel-title">By role</h2>
                <ul className="role-stats">
                  {Object.entries(ROLES).map(([key, r]) => {
                    const s = stats.byRole[key] || { games: 0, wins: 0 };
                    return (
                      <li key={key} className={`tone-${r.tone}`}>
                        <span className="role-glyph"><RoleIcon role={key} /></span>
                        <div className="role-stats-main">
                          <div className="role-stats-row">
                            <b>{r.label}</b>
                            <span>{s.wins}W · {s.games - s.wins}L · <b>{pct(s.wins, s.games)}%</b></span>
                          </div>
                          <div className="bar bar-tone"><span style={{ transform: `scaleX(${pct(s.wins, s.games) / 100})` }} /></div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="panel cut" aria-labelledby="recent">
                <h2 id="recent" className="panel-title">Recent games</h2>
                {stats.recent.length === 0 ? (
                  <p className="dim small">Your last games will appear here.</p>
                ) : (
                  <ul className="recent">
                    {stats.recent.map((g, i) => (
                      <li key={i}>
                        <span className={`result ${g.won ? 'won' : 'lost'}`}>{g.won ? 'Win' : 'Loss'}</span>
                        <span className={`recent-role tone-${ROLES[g.role]?.tone}`}><RoleIcon role={g.role} /> {ROLES[g.role]?.label || g.role}</span>
                        <span className="dim small">{ago(g.at)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <div className="career-foot">
              {saved ? (
                <p className="dim small"><Icon name="check" /> Saved to your Google account, on every device.</p>
              ) : (
                <>
                  <p className="dim small">Stats are saved in this browser only. Sign in with Google on the Play screen to keep them on every device.</p>
                  <button className={`b b-sm ${confirm ? 'b-danger' : 'b-ghost'}`} onClick={reset}>
                    {confirm ? 'Click again to erase everything' : 'Reset stats'}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <PoweredBy className="foot" />
    </main>
  );
}
