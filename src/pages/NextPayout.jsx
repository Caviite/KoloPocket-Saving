import React, { useState, useContext, useEffect } from 'react';
import { authContext } from '../Context/authcontext';
import { privateInstance } from '../api/api';
import { useNavigate } from 'react-router-dom';
import './NextPayout.css';
import ButtomNav from '../Component/BottomNav';

// Icon Component
const Icon = ({ name, size = 24, color = "currentColor" }) => {
  const ICON_PATHS = {
    arrowLeft: <polyline points="15 18 9 12 15 6" />,
    arrowRight: <polyline points="9 18 15 12 9 6" />,
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    folder: (
      <>
        <path d="M22 19a2 2 0 01-2.414-1.80078c-.874-.726-2.612-2.707-4.46-6.702-.973-2.143-1.784-4.588-2.953-7.111a1 1 0 00-.elevate-.106H2a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    gift: (
      <>
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M7 5h10a2 2 0 012 2v2H5V7a2 2 0 012-2z" />
      </>
    ),
    zap: <polyline points="13 2 3 14 12 14 2 22" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICON_PATHS[name] || ICON_PATHS.arrowRight}
    </svg>
  );
};

export default function NextPayout() {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(authContext);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all user's groups
        const groupRes = await privateInstance.get('/creategroup/getMyGroups');
        const groups = groupRes.data?.groups || [];

        if (groups.length === 0) {
          setPayouts([]);
          setLoading(false);
          return;
        }

        let allPayouts = [];

        // For each group, get contributions to find next payout
        for (const group of groups) {
          try {
            const contribRes = await privateInstance.get(`/api/contributions/group/${group._id}`);

            if (contribRes.data?.contributions) {
              const contributions = contribRes.data.contributions
                .filter(c => c.status === 'completed')
                .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));


              if (contributions.length > 0) {
                // Get next payout (most recent contribution)
                const nextPayout = contributions[0];

                // Get contributor name - with better fallback
                let contributorName = nextPayout.contributorName || 'Unknown';
                let contributorInitial = (nextPayout.contributorName || 'U')[0]?.toUpperCase();

                if (nextPayout.contributorId) {
                  if (typeof nextPayout.contributorId === 'object' && nextPayout.contributorId.name) {
                    // If it's an object with name property
                    contributorName = nextPayout.contributorId.name;
                    contributorInitial = nextPayout.contributorId.name[0]?.toUpperCase() || 'U';
                  } else if (typeof nextPayout.contributorId === 'string') {
                    // If it's just an ID, try to find the name from group contributors
                    const groupContributor = group.contributors?.find(
                      c => c._id === nextPayout.contributorId || c === nextPayout.contributorId
                    );
                    if (groupContributor) {
                      contributorName = groupContributor.name || 'Unknown Contributor';
                      contributorInitial = (groupContributor.name || 'U')[0]?.toUpperCase();
                    }
                  }
                }

                allPayouts.push({
                  id: nextPayout._id,
                  groupId: group._id,
                  groupName: group.name,
                  groupIcon: group.cycleType === 'daily' ? '📅' : group.cycleType === 'weekly' ? '📆' : '🗓️',
                  contributorName: contributorName,
                  contributorInitial: contributorInitial,
                  amount: nextPayout.amount,
                  daysLeft: group.cycleDuration || 30,
                  paymentDate: nextPayout.paymentDate,
                  status: nextPayout.status,
                  cycleType: group.cycleType
                });
              }
            }
          } catch (groupErr) {
            console.warn(`⚠️ Error fetching payouts for group ${group._id}:`, groupErr.message);
          }
        }

        // Sort by days left (urgent first)
        allPayouts.sort((a, b) => a.daysLeft - b.daysLeft);
        setPayouts(allPayouts);

      } catch (err) {
        console.error('❌ Error fetching payouts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPayouts();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="next-payout-container">
        <div className="payout-header">
          <div className="header-content">
            <Icon name="gift" size={24} color="#16a34a" />
            <h2>Upcoming Payouts</h2>
          </div>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading payouts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="next-payout-container">
        <div className="payout-header">
          <div className="header-content">
            <Icon name="gift" size={24} color="#16a34a" />
            <h2>Upcoming Payouts</h2>
          </div>
        </div>
        <div className="error-state">
          <Icon name="zap" size={32} color="#ef4444" />
          <p>Error loading payouts: {error}</p>
        </div>
      </div>
    );
  }

  if (payouts.length === 0) {
    return (
      <div className="next-payout-container">
        <div className="payout-header">
          <div className="header-content">
            <div className="header-left">
              <Icon name="gift" size={24} color="#16a34a" />
              <h2>Upcoming Payouts</h2>
            </div>
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <Icon name="arrowLeft" size={18} color="#16a34a" />
              Back
            </button>
          </div>
        </div>
        <div className="empty-state">
          <Icon name="calendar" size={40} color="#d1d5db" />
          <p>No upcoming payouts yet</p>
          <span>Payouts will appear once contributions are received</span>
        </div>
      </div>
    );
  }

  return (
    <div className="next-payout-container">
      {/* Header with Back Button */}
      <div className="payout-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <Icon name="arrowLeft" size={18} color="#16a34a" />
          Back
        </button>
        <div className="header-content">
          <Icon name="gift" size={24} color="#16a34a" />
          <div className="header-text">
            <h2>Upcoming Payouts</h2>
            <span className="payout-count">{payouts.length} pending</span>
          </div>
        </div>
      </div>

      {/* Payouts List */}
      <div className="payouts-list">
        {payouts.map((payout, idx) => (
          <div key={payout.id} className="payout-card">
            {/* Priority Badge - NOW WITH AMOUNT */}
            {idx === 0 && (
              <div className="priority-badge">
                <Icon name="zap" size={14} color="#fff" />
                <span>Next - ₦{payout.amount.toLocaleString('en-NG')}</span>
              </div>
            )}

            {/* Main Content */}
            <div className="payout-main">
              {/* Left: Contributor Info */}
              <div className="contributor-info">
                <div className="contributor-avatar">
                  {payout.contributorInitial}
                </div>
                <div className="contributor-details">
                  <div className="contributor-name">{payout.contributorName}</div>
                  <div className="group-badge">
                    <Icon name="folder" size={14} color="#94a3b8" />
                    {payout.groupName}
                  </div>
                </div>
              </div>

              {/* Right: Amount & Timeline */}
              <div className="payout-amount-section">
                <div className="amount">₦{payout.amount.toLocaleString('en-NG')}</div>
                <div className="timeline">
                  <Icon name="clock" size={14} color="#f59e0b" />
                  <span className="days-left">
                    {payout.daysLeft > 0 ? `in ${payout.daysLeft} days` : 'Today'}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="payout-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.max(0, (30 - payout.daysLeft) / 30 * 100)}%`
                  }}
                ></div>
              </div>
              <div className="progress-label">
                {payout.daysLeft > 0 ? `${Math.round((30 - payout.daysLeft) / 30 * 100)}% complete` : 'Ready'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="payout-summary">
        <div className="summary-item">
          <Icon name="check" size={18} color="#16a34a" />
          <div>
            <span className="label">Total Pending</span>
            <span className="value">
              ₦{payouts.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-NG')}
            </span>
          </div>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <Icon name="calendar" size={18} color="#3b82f6" />
          <div>
            <span className="label">Groups Active</span>
            <span className="value">{new Set(payouts.map(p => p.groupId)).size}</span>
          </div>
        </div>
      </div>
      <ButtomNav/>
    </div>
    
  );
}