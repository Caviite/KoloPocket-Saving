import React, { useState, useContext, useEffect, useCallback } from 'react';
import { authContext } from '../Context/authcontext';
import { privateInstance } from '../api/api';
import { useNavigate } from 'react-router-dom';
import './NextPayout.css';
import BottomNav from '../Component/BottomNav';

// ─── Icon Set ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, className = '' }) => {
  const paths = {
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    naira: <path d="M5 6h14M5 18h14M7 6l10 12M17 6L7 18M5 12h14" />,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    inbox: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
    refresh: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────
const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount || 0);

const cycleIcon = (type) => ({ daily: '☉', weekly: '☾', monthly: '✦' }[type] || '✦');

// ─── Rotation Dial ────────────────────────────────────────────────────────
// The signature element: a clock-like ring of ticks representing every seat
// in the rotation, with the current position lit up. This is the one bold
// visual choice — everything else in the page stays quiet around it.
const RotationDial = ({ total = 1, position = null, initials = '?', size = 64, tone = 'ready' }) => {
  const center = size / 2;
  const radius = size / 2 - 6;
  const dotRadius = size < 56 ? 2.2 : 2.8;
  const count = Math.max(total, 1);

  const dots = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const cx = center + radius * Math.cos(angle);
    const cy = center + radius * Math.sin(angle);
    const isActive = position != null && i === position - 1;
    return { cx, cy, isActive };
  });

  return (
    <div className={`rp-dial rp-dial--${tone}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rp-dial-ring">
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.isActive ? dotRadius + 1.1 : dotRadius}
            className={d.isActive ? 'rp-dial-dot rp-dial-dot--active' : 'rp-dial-dot'}
          />
        ))}
      </svg>
      <div className="rp-dial-avatar">{initials}</div>
    </div>
  );
};

// ─── Card States ──────────────────────────────────────────────────────────
const ReadyCard = ({ entry }) => (
  <div className="rp-card rp-card--ready">
    <div className="rp-card-top">
      <span className="rp-group-tag">
        <span className="rp-group-glyph">{cycleIcon(entry.cycleType)}</span>
        {entry.groupName}
      </span>
      <span className="rp-status-pill rp-status-pill--ready">
        <Icon name="check" size={11} />
        Ready
      </span>
    </div>

    <div className="rp-card-body">
      <RotationDial
        total={entry.totalContributors}
        position={entry.position}
        initials={entry.initials}
        tone="ready"
      />
      <div className="rp-card-person">
        <span className="rp-person-name">{entry.contributorName}</span>
        <span className="rp-person-position">
          Seat {entry.position ?? '—'} <span className="rp-position-of">/ {entry.totalContributors}</span>
        </span>
      </div>
    </div>

    <div className="rp-card-amount-row">
      <div>
        <span className="rp-amount-label">Net payout due</span>
        <span className="rp-amount-value">{formatNaira(entry.amount)}</span>
      </div>
      <button className="rp-go-btn" onClick={entry.onGoToPayout} aria-label={`Go send payout for ${entry.contributorName}`}>
        Send →
      </button>
    </div>
  </div>
);

const WaitingCard = ({ entry }) => (
  <div className="rp-card rp-card--waiting">
    <div className="rp-card-top">
      <span className="rp-group-tag">
        <span className="rp-group-glyph">{cycleIcon(entry.cycleType)}</span>
        {entry.groupName}
      </span>
      <span className="rp-status-pill rp-status-pill--waiting">
        <Icon name="clock" size={11} />
        Waiting
      </span>
    </div>

    <div className="rp-waiting-body">
      <Icon name="alert" size={16} className="rp-waiting-icon" />
      <div>
        <p className="rp-waiting-headline">
          {entry.paidCount} of {entry.totalContributors} paid this cycle
        </p>
        {entry.unpaidNames?.length > 0 && (
          <p className="rp-waiting-sub">Still owing: {entry.unpaidNames.join(', ')}</p>
        )}
      </div>
    </div>

    <div className="rp-waiting-track">
      <div
        className="rp-waiting-fill"
        style={{ width: `${entry.totalContributors ? (entry.paidCount / entry.totalContributors) * 100 : 0}%` }}
      />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────
export default function NextPayout() {
  const navigate = useNavigate();
  const { user } = useContext(authContext);

  const [readyEntries, setReadyEntries] = useState([]);
  const [waitingEntries, setWaitingEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const groupRes = await privateInstance.get('/creategroup/getMyGroups');
      const groups = groupRes.data?.groups || [];

      const ready = [];
      const waiting = [];

      await Promise.all(
        groups.map(async (group) => {
          try {
            const res = await privateInstance.get(`/api/payouts/readiness/${group._id}`);
            const status = res.data;
            if (!status?.success) return;

            if (status.ready && status.nextContributor) {
              const name = status.nextContributor.name || 'Contributor';
              ready.push({
                groupId: group._id,
                groupName: group.name,
                cycleType: group.cycleType,
                contributorName: name,
                initials: name.charAt(0).toUpperCase(),
                position: status.nextContributor.position,
                totalContributors: status.totalContributors,
                amount: status.payoutAmount,
              });
            } else {
              waiting.push({
                groupId: group._id,
                groupName: group.name,
                cycleType: group.cycleType,
                totalContributors: status.totalContributors,
                paidCount: status.paidCount,
                unpaidNames: (status.unpaidContributors || []).map((c) => c.name),
              });
            }
          } catch (groupErr) {
            console.warn(`⚠️ Readiness check failed for group ${group._id}:`, groupErr.message);
          }
        })
      );

      // Highest payout first among ready groups — most consequential action surfaces first
      ready.sort((a, b) => (b.amount || 0) - (a.amount || 0));
      // Closest to complete first among waiting groups — least effort to unblock
      waiting.sort((a, b) => (b.paidCount / (b.totalContributors || 1)) - (a.paidCount / (a.totalContributors || 1)));

      setReadyEntries(ready);
      setWaitingEntries(waiting);
    } catch (err) {
      console.error('❌ Error fetching payout rotation data:', err);
      setError(err.message || 'Unable to load rotation data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) fetchAll();
  }, [user?.id, fetchAll]);

  const totalReadyAmount = readyEntries.reduce((sum, e) => sum + (e.amount || 0), 0);
  const goToPayout = () => navigate('/send-payout');

  return (
    <div className="rp-root">
      <header className="rp-header">
        <button className="rp-back-btn" onClick={() => navigate('/dashboard')}>
          <Icon name="arrowLeft" size={16} />
          Back
        </button>
        <div className="rp-header-titles">
          <span className="rp-eyebrow">Rotation Overview</span>
          <h1>Who's Collecting Next</h1>
        </div>
        <button className="rp-refresh-btn" onClick={fetchAll} disabled={loading} aria-label="Refresh">
          <Icon name="refresh" size={16} />
        </button>
      </header>

      {loading ? (
        <div className="rp-center-state">
          <div className="rp-spinner" />
          <p>Checking every group's rotation…</p>
        </div>
      ) : error ? (
        <div className="rp-center-state rp-center-state--error">
          <Icon name="alert" size={28} />
          <p>{error}</p>
          <button className="rp-retry-btn" onClick={fetchAll}>Try again</button>
        </div>
      ) : readyEntries.length === 0 && waitingEntries.length === 0 ? (
        <div className="rp-center-state">
          <Icon name="inbox" size={32} />
          <p className="rp-empty-title">No active rotations yet</p>
          <span className="rp-empty-sub">Once a group has contributors, their rotation will show up here.</span>
        </div>
      ) : (
        <>
          <div className="rp-summary-strip">
            <div className="rp-summary-pill">
              <span className="rp-summary-value">{readyEntries.length}</span>
              <span className="rp-summary-label">Ready to pay</span>
            </div>
            <div className="rp-summary-pill">
              <span className="rp-summary-value">{formatNaira(totalReadyAmount)}</span>
              <span className="rp-summary-label">Total due now</span>
            </div>
            <div className="rp-summary-pill">
              <span className="rp-summary-value">{waitingEntries.length}</span>
              <span className="rp-summary-label">Still collecting</span>
            </div>
          </div>

          {readyEntries.length > 0 && (
            <section className="rp-section">
              <h2 className="rp-section-title">Ready for payout</h2>
              <div className="rp-grid">
                {readyEntries.map((entry) => (
                  <ReadyCard key={entry.groupId} entry={{ ...entry, onGoToPayout: goToPayout }} />
                ))}
              </div>
            </section>
          )}

          {waitingEntries.length > 0 && (
            <section className="rp-section">
              <h2 className="rp-section-title">Still collecting this cycle</h2>
              <div className="rp-grid">
                {waitingEntries.map((entry) => (
                  <WaitingCard key={entry.groupId} entry={entry} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <BottomNav activeNav="payouts" />
    </div>
  );
}