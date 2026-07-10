import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { privateInstance } from "../api/api";
import './SendPayout.css';

// ─── Internal SVG Icon System ────────────────────────────────────────────────
const Icon = ({ name, size = 20, className = '' }) => {
  const icons = {
    groups: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    naira: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 6h14M5 18h14M7 6l10 12M17 6L7 18M5 12h14" />
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    cycle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    phone: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.46 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.38 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    send: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    close: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    receipt: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    empty: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    warning: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    arrowLeft: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    )
  };

  return icons[name] || null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);

const getCycleLabel = (type) => {
  const map = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
  return map[type?.toLowerCase()] || type || '—';
};

const Spinner = ({ size = 18 }) => (
  <span className="sp-spinner" style={{ width: size, height: size }} aria-hidden="true" />
);

// ─── Receipt Modal ────────────────────────────────────────────────────────────
const ReceiptModal = ({ group, contributor, walletBalance, onClose, onConfirm, submitting, success }) => {
  if (!group || !contributor) return null;

  const memberCount = group.contributors?.length || 1;
  const cycleAmount = Number(group.amount) || 0;
  const flatFee = Number(group.commissionAmount) || 0;
  const totalPool = cycleAmount * memberCount;
  const netPayout = totalPool - flatFee;

  const isBalanceInsufficient = walletBalance < netPayout;

  const now = new Date();
  const receiptDate = now.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
  const receiptTime = now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="sp-modal-backdrop" role="dialog" aria-modal="true" aria-label="Payout confirmation" onClick={(e) => e.target === e.currentTarget && !submitting && !success && onClose()}>
      <div className={`sp-modal ${success ? 'sp-modal--success' : ''}`}>
        {success ? (
          <div className="sp-success-screen">
            <div className="sp-success-ring">
              <Icon name="check" size={36} className="sp-success-icon" />
            </div>
            <h3 className="sp-success-title">Payout Sent</h3>
            <p className="sp-success-sub">
              {formatNaira(netPayout)} dispatched to <strong>{contributor.name}</strong>.
            </p>
            <p className="sp-success-group">{group.name} · Cycle advanced</p>
            <button className="sp-btn sp-btn--primary sp-btn--full" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="sp-modal-header">
              <div className="sp-modal-header-left">
                <Icon name="receipt" size={18} />
                <span>Distribution Slip</span>
              </div>
              <button className="sp-modal-close" onClick={onClose} disabled={submitting} aria-label="Close">
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="sp-receipt-wallet-info" style={{ padding: '12px 16px', background: '#f9fafb', borderRadius: '8px', margin: '0 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Available Wallet Balance:</span>
              <span style={{ fontSize: '14px', color: '#111827', fontWeight: '700', marginLeft: 'auto' }}>{formatNaira(walletBalance)}</span>
            </div>

            {/* 🛑 Fixed Object Style Definition Block 👇 */}
            {isBalanceInsufficient && (
              <div className="sp-insufficient-error-banner" style={{ margin: '0 16px 12px 16px', padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Icon name="warning" size={18} style={{ color: '#ef4444' }} />
                <div style={{ fontSize: '13px', color: '#991b1b', fontWeight: '600' }}>
                  Insufficient balance to complete payout distribution.
                </div>
              </div>
            )}

            <div className="sp-receipt">
              <div className="sp-receipt-top">
                <p className="sp-receipt-brand">KoloPocket</p>
                <p className="sp-receipt-meta">{receiptDate} · {receiptTime}</p>
                <p className="sp-receipt-meta">{group.name}</p>
              </div>

              <div className="sp-receipt-dashes" aria-hidden="true">
                {'- '.repeat(22)}
              </div>

              <div className="sp-receipt-row sp-receipt-row--label">
                <span>RECIPIENT</span>
              </div>
              <div className="sp-receipt-row sp-receipt-row--value">
                <span>{contributor.name}</span>
                <span className="sp-receipt-phone">{contributor.phone}</span>
              </div>

              <div className="sp-receipt-dashes" aria-hidden="true">
                {'- '.repeat(22)}
              </div>

              <div className="sp-receipt-ledger">
                <div className="sp-receipt-row">
                  <span>Contribution × {memberCount} members</span>
                  <span className="sp-receipt-amount">{formatNaira(cycleAmount)} ea.</span>
                </div>
                <div className="sp-receipt-row sp-receipt-row--subtotal">
                  <span>Total Pool Collected</span>
                  <span>{formatNaira(totalPool)}</span>
                </div>
                <div className="sp-receipt-row sp-receipt-row--fee">
                  <span>Management Commission</span>
                  <span>− {formatNaira(flatFee)}</span>
                </div>
              </div>

              <div className="sp-receipt-dashes" aria-hidden="true">
                {'= '.repeat(22)}
              </div>

              <div className="sp-receipt-row sp-receipt-row--net">
                <span>NET PAYOUT</span>
                <span className="sp-receipt-net-amount">{formatNaira(netPayout)}</span>
              </div>

              <div className="sp-receipt-dashes" aria-hidden="true">
                {'- '.repeat(22)}
              </div>

              <p className="sp-receipt-footer">
                Confirming will log this payout and advance the rotation cycle.
              </p>
            </div>

            <div className="sp-modal-actions">
              <button className="sp-btn sp-btn--ghost" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button
                className="sp-btn sp-btn--primary"
                onClick={onConfirm}
                disabled={submitting || isBalanceInsufficient}
                style={isBalanceInsufficient ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#9ca3af' } : {}}
              >
                {submitting ? (
                  <><Spinner size={16} /> Processing…</>
                ) : (
                  <><Icon name="send" size={16} /> Confirm & Send</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SendPayout = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupsError, setGroupsError] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedContributor, setSelectedContributor] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchGroupsAndWallet = useCallback(async () => {
    try {
      setLoadingGroups(true);
      setGroupsError(null);

      const res = await privateInstance.get('/creategroup/getMyGroups');
      const data = Array.isArray(res.data) ? res.data : res.data?.groups || res.data?.allGroups || [];

      let totalCollectedAmount = 0;
      let totalPaidOutAmount = 0;

      for (const group of data) {
        try {
          const commRes = await privateInstance.get(`/api/commissions/group/${group._id}`);
          if (commRes.data?.commission) {
            totalPaidOutAmount += commRes.data.commission.totalPayoutsDistributed || 0;
          }

          const contribRes = await privateInstance.get(`/api/contributions/group/${group._id}`);
          if (contribRes.data?.contributions) {
            contribRes.data.contributions.forEach(c => {
              if (c.status === 'completed') {
                totalCollectedAmount += c.amount || 0;
              }
            });
          }
        } catch (err) {
          console.warn(`Error compiling balance variables:`, err.message);
        }
      }

      setWalletBalance(Math.max(0, totalCollectedAmount - totalPaidOutAmount));

      const active = data.filter(
        (g) => g.contributors?.length > 0 && g.isActive !== false
      );
      setGroups(active);
    } catch (err) {
      setGroupsError('Unable to load workspace parameters. Please retry.');
    } finally {
      setLoadingGroups(false);
    }
  }, []);

  useEffect(() => {
    fetchGroupsAndWallet();
  }, [fetchGroupsAndWallet]);

  const handleSelectGroup = (group) => {
    if (selectedGroup?._id === group._id) return;
    setSelectedGroup(group);
    setSelectedContributor(null);
    setSuccess(false);
  };

  const handleSelectContributor = (contributor) => {
    setSelectedContributor(contributor);
    setSuccess(false);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setTimeout(() => {
      setSelectedContributor(null);
      setSuccess(false);
    }, 200);
  };

  const handleConfirmPayout = async () => {
    if (!selectedGroup || !selectedContributor) return;
    try {
      setSubmitting(true);

      await privateInstance.post('/api/payouts/send', {
        groupId: selectedGroup._id,
        contributorId: selectedContributor._id,
      });

      setSuccess(true);
      fetchGroupsAndWallet();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Payout allocation error.';
      alert(msg);
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && modalOpen && !submitting && !success) handleCloseModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, submitting, success]);

  return (
    <div className="sp-root">
      <header className="sp-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="sp-page-header-icon">
            <Icon name="send" size={20} />
          </div>
          <div>
            <h1 className="sp-page-title">Send Payout</h1>
            <p className="sp-page-subtitle">Log and distribute rotation cycle payments to contributors</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #d1d5db', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#374151', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        >
          <Icon name="arrowLeft" size={16} />
          Back
        </button>
      </header>

      <div className="sp-grid">
        <aside className="sp-panel sp-panel--left">
          <div className="sp-panel-header">
            <Icon name="groups" size={16} />
            <span className="sp-panel-label">Active Savings Groups</span>
            {!loadingGroups && (
              <span className="sp-badge">{groups.length}</span>
            )}
          </div>

          {loadingGroups ? (
            <div className="sp-center-state">
              <Spinner size={28} />
              <p className="sp-state-text">Loading groups…</p>
            </div>
          ) : groupsError ? (
            <div className="sp-center-state sp-center-state--error">
              <Icon name="warning" size={32} className="sp-state-icon--error" />
              <p className="sp-state-text">{groupsError}</p>
              <button className="sp-btn sp-btn--ghost sp-btn--sm" onClick={fetchGroupsAndWallet}>
                Retry
              </button>
            </div>
          ) : groups.length === 0 ? (
            <div className="sp-center-state">
              <Icon name="groups" size={36} className="sp-state-icon--muted" />
              <p className="sp-state-text">No active groups with pending payouts.</p>
            </div>
          ) : (
            <ul className="sp-group-list" role="listbox" aria-label="Savings groups">
              {groups.map((group) => {
                const isSelected = selectedGroup?._id === group._id;
                const memberCount = group.contributors?.length || 0;
                const cycleAmount = Number(group.amount) || 0;
                const cycleRound = group.currentCycleProgress || group.cycleRound || 1;

                return (
                  <li
                    key={group._id}
                    className={`sp-group-card ${isSelected ? 'sp-group-card--active' : ''}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectGroup(group)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleSelectGroup(group)}
                  >
                    <div className="sp-group-card-top">
                      <span className="sp-group-name">{group.name}</span>
                      <span className={`sp-cycle-badge sp-cycle-badge--${group.cycleType?.toLowerCase() || 'monthly'}`}>
                        {getCycleLabel(group.cycleType)}
                      </span>
                    </div>

                    <div className="sp-group-card-meta">
                      <span className="sp-meta-item">
                        <Icon name="naira" size={13} />
                        {formatNaira(cycleAmount)} / person
                      </span>
                      <span className="sp-meta-item">
                        <Icon name="groups" size={13} />
                        {memberCount} members
                      </span>
                    </div>

                    <div className="sp-group-card-footer">
                      <Icon name="cycle" size={13} />
                      <span>Cycle Progress: Round {cycleRound}</span>
                    </div>

                    {isSelected && (
                      <div className="sp-group-card-indicator" aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <main className="sp-panel sp-panel--right">
          {!selectedGroup ? (
            <div className="sp-empty-state">
              <div className="sp-empty-illustration">
                <div className="sp-empty-rings">
                  <div className="sp-empty-ring sp-empty-ring--outer" />
                  <div className="sp-empty-ring sp-empty-ring--inner" />
                  <Icon name="empty" size={32} className="sp-empty-icon" />
                </div>
              </div>
              <h2 className="sp-empty-title">Select a savings group</h2>
              <p className="sp-empty-sub">
                Choose a group from the left to view contributors and manage cycle distributions.
              </p>
            </div>
          ) : (
            <div className="sp-action-panel">
              <div className="sp-action-header">
                <div>
                  <h2 className="sp-action-title">{selectedGroup.name}</h2>
                  <p className="sp-action-sub">
                    Select a contributor to process their rotation payout
                  </p>
                </div>
                <div className="sp-action-stats">
                  <div className="sp-stat">
                    <span className="sp-stat-value">
                      {formatNaira(Number(selectedGroup.amount) * (selectedGroup.contributors?.length || 0))}
                    </span>
                    <span className="sp-stat-label">Pool this cycle</span>
                  </div>
                  <div className="sp-stat">
                    <span className="sp-stat-value sp-stat-value--green">
                      {formatNaira(
                        (Number(selectedGroup.amount) * (selectedGroup.contributors?.length || 0)) -
                        Number(selectedGroup.commissionAmount || 0)
                      )}
                    </span>
                    <span className="sp-stat-label">After commission</span>
                  </div>
                </div>
              </div>

              <ul className="sp-contributor-list" aria-label="Contributors">
                {selectedGroup.contributors?.length === 0 ? (
                  <li className="sp-contributor-empty">No contributors found in this group.</li>
                ) : (
                  selectedGroup.contributors.map((contributor) => (
                    <li key={contributor._id} className="sp-contributor-card">
                      <div className="sp-contributor-avatar" aria-hidden="true">
                        {contributor.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="sp-contributor-info">
                        <span className="sp-contributor-name">
                          <Icon name="user" size={13} />
                          {contributor.name}
                        </span>
                        <span className="sp-contributor-phone">
                          <Icon name="phone" size={13} />
                          {contributor.phone}
                        </span>
                      </div>
                      <button
                        className="sp-btn sp-btn--payout"
                        onClick={() => handleSelectContributor(contributor)}
                        aria-label={`Select ${contributor.name} for payout`}
                      >
                        <Icon name="send" size={14} />
                        Select for Payout
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <ReceiptModal
          group={selectedGroup}
          contributor={selectedContributor}
          walletBalance={walletBalance}
          onClose={handleCloseModal}
          onConfirm={handleConfirmPayout}
          submitting={submitting}
          success={success}
        />
      )}
    </div>
  );
};

export default SendPayout;