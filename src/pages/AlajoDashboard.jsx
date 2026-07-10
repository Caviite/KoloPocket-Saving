import { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../Context/authcontext";
import { privateInstance } from "../api/api";
import "./AlajoDashboard.css";
import kplogo from "../pages/Dashboard logo.png";
import Sidebar from "../Component/Sidebar"; 
import BottomNav from "../Component/BottomNav";

// ── Icons Dictionary (Clean SVG Paths) ───────────────────────────────────────
const ICON_PATHS = {
  home: <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-9" />,
  ajo: (
    <>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  transactions: (
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </>
  ),
  wallet: (
    <>
      <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
      <circle cx="16" cy="14" r="2" />
    </>
  ),
  beneficiaries: (
    <>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="23" y1="11" x2="17" y2="11" />
      <line x1="20" y1="8" x2="20" y2="14" />
    </>
  ),
  support: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  arrowUp: (
    <>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </>
  ),
  arrowRight: <polyline points="9 18 15 12 9 6" />,
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chart: (
    <>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </>
  ),
  check: <polyline points="20 6 9 13 4 10" />,
  profile: (
    <>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  group: (
    <>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  arrowDown: (
    <g transform="rotate(180 12 12)">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </g>
  )
};

const Icon = ({ name, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {ICON_PATHS[name] || null}
  </svg>
);

// ── Sub-Components (Clean Render Layouts) ────────────────────────────────────
const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`nav-item${active ? " active" : ""}`}>
    <Icon name={icon} size={18} color={active ? "#fff" : "#6b7280"} />
    {label}
  </button>
);

const StatCard = ({ icon, label, value, sub }) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <div className="stat-icon-wrap">
        <Icon name={icon} size={18} color="#16a34a" />
      </div>
      <span className="stat-label">{label}</span>
    </div>
    <div className="stat-value">{value}</div>
    {sub && <button className="stat-link-btn">{sub}</button>}
  </div>
);

const ProgressBar = ({ percent }) => (
  <div className="progress-track">
    <div className="progress-fill" style={{ width: `${percent}%` }} />
  </div>
);

const AjoRow = ({ name, amount, frequency, members, currentProgress, total, percent, color }) => {
  const cycleText = useMemo(() => {
    const freq = frequency?.toLowerCase() || "";
    if (currentProgress >= total) return "Completed 🎉";
    if (freq === "daily" || freq === "day") return `Day ${currentProgress} of ${total}`;
    if (freq === "monthly" || freq === "month") return `Month ${currentProgress} of ${total}`;
    return `Week ${currentProgress} of ${total}`;
  }, [frequency, currentProgress, total]);

  return (
    <div className="ajo-row">
      <div className="ajo-icon-wrap" style={{ background: `${color}22` }}>
        <Icon name="group" size={18} color={color} />
      </div>
      <div className="ajo-info">
        <div className="ajo-name">{name}</div>
        <div className="ajo-meta">
          ₦{amount.toLocaleString()} {frequency} · {members} members
        </div>
        <ProgressBar percent={percent} />
      </div>
      <div className="ajo-cycle">
        <div className="ajo-cycle-weeks" style={{ whiteSpace: "nowrap" }}>
          {cycleText}
        </div>
        <div className="ajo-cycle-percent">
          {currentProgress >= total ? "100%" : `${percent}%`}
        </div>
      </div>
      <div className="ajo-arrow">
        <Icon name="arrowRight" size={16} />
      </div>
    </div>
  );
};

const TxRow = ({ icon, label, sub, amount, date, positive }) => (
  <div className="tx-row">
    <div className={`tx-icon-wrap ${positive ? "positive" : "negative"}`}>
      <Icon name={icon} size={17} color={positive ? "#16a34a" : "#ef4444"} />
    </div>
    <div className="tx-info">
      <div className="tx-label">{label}</div>
      <div className="tx-sub">{sub}</div>
    </div>
    <div className="tx-amount-col">
      <div className={`tx-amount ${positive ? "positive" : "negative"}`}>
        {positive ? "+" : "-"}₦{Math.abs(amount).toLocaleString()}
      </div>
      <div className="tx-date">{date}</div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="loading-state">
    <div className="spinner">
      <div className="spinner-ring"></div>
    </div>
    <p className="loading-text">Fetching your Ajo groups...</p>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className="empty-state">
    <div className="empty-icon-wrap">
      <Icon name={icon} size={24} color="#86efac" />
    </div>
    <p className="empty-text">{message}</p>
  </div>
);

export default function AlajoDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeAjos, setActiveAjos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [payoutTransactions, setPayoutTransactions] = useState([]);
  
  const [dashboardStats, setDashboardStats] = useState({
    totalContributions: 0,
    totalPayouts: 0,
  });
  const [nextPayout, setNextPayout] = useState({ amount: 0, date: "—" });

  const navigate = useNavigate();
  const { user, logOut } = useContext(authContext);

  const navItems = [
    { key: "dashboard", icon: "home", label: "Dashboard" },
    { key: "myajo", icon: "ajo", label: "My Ajo" },
    { key: "transactions", icon: "transactions", label: "Transactions" },
    { key: "wallet", icon: "wallet", label: "Commission" },
    { key: "beneficiaries", icon: "beneficiaries", label: "Beneficiaries" },
    { key: "support", icon: "support", label: "Support" },
    { key: "settings", icon: "settings", label: "Settings" },
  ];

  const stats = useMemo(() => {
    const completedCount = activeAjos.filter(ajo => ajo.currentProgress >= ajo.total).length;
    const activeCount = activeAjos.length - completedCount;

    return {
      activeAjo: activeCount,
      completedAjo: completedCount,
      totalContributions: dashboardStats.totalContributions,
      totalPayouts: dashboardStats.totalPayouts,
    };
  }, [activeAjos, dashboardStats.totalContributions, dashboardStats.totalPayouts]);

  useEffect(() => {
    const fetchDashboardFinancialsAndAjos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await privateInstance.get('/creategroup/getMyGroups');
        const groupData = response.data?.groups || [];

        let totalCollectedAmount = 0;
        let totalPaidOutAmount = 0;
        
        let allContributions = [];
        let allPayoutLogs = [];
        const nextPayoutsData = [];

        for (const group of groupData) {
          try {
            // 1. Fetch live commissions mapping tracking profiles
            const commRes = await privateInstance.get(`/api/commissions/group/${group._id}`);
            if (commRes.data?.commission) {
              const comm = commRes.data.commission;
              totalPaidOutAmount += comm.totalPayoutsDistributed || 0;

              if (comm.totalPayoutsDistributed > 0) {
                allPayoutLogs.push({
                  icon: "arrowDown",
                  label: group.name,
                  sub: "Cycle Distribution Payout",
                  amount: comm.totalPayoutsDistributed,
                  date: new Date(comm.updatedAt || new Date()).toLocaleDateString("en-NG"),
                  positive: false
                });
              }
            }

            // 2. Fetch Contributions records
            const contribRes = await privateInstance.get(`/api/contributions/group/${group._id}`);
            if (contribRes.data?.contributions) {
              const contributions = contribRes.data.contributions;

              contributions.forEach(c => {
                if (c.status === 'completed') {
                  totalCollectedAmount += c.amount || 0;
                }
              });

              contributions.forEach(c => {
                allContributions.push({
                  icon: "plus",
                  label: group.name,
                  sub: `From ${c.contributorId?.name || "Contributor"}`,
                  amount: c.amount,
                  date: new Date(c.paymentDate).toLocaleDateString("en-NG"),
                  positive: true
                });
              });

              if (contributions.length > 0) {
                const nextPayoutAmount = contributions[contributions.length - 1].amount;
                nextPayoutsData.push({
                  groupName: group.name,
                  amount: nextPayoutAmount,
                  daysLeft: group.cycleDuration || 30
                });
              }
            }
          } catch (groupErr) {
            console.warn(`⚠️ Error processing group ${group._id}:`, groupErr.message);
          }
        }

        // 💡 WALLET MATHEMATICS CORRECTION FIXED: 
        // Main structural rotation wallet now handles floating rotational liquidity cleanly.
        const netWalletBalance = Math.max(0, totalCollectedAmount - totalPaidOutAmount);
        setWalletBalance(netWalletBalance); 
        
        setDashboardStats({
          totalContributions: totalCollectedAmount,
          totalPayouts: totalPaidOutAmount
        });

        if (nextPayoutsData.length > 0) {
          setNextPayout({
            amount: nextPayoutsData[0].amount,
            date: nextPayoutsData[0].daysLeft > 0 ? `in ${nextPayoutsData[0].daysLeft} days` : "Today"
          });
        } else {
          setNextPayout({ amount: 0, date: "—" });
        }

        setTransactions(allContributions.slice(0, 5));
        setPayoutTransactions(allPayoutLogs.slice(0, 5));

        const formattedAjos = groupData.map(ajo => {
          const totalDuration = Number(ajo.cycleDuration) || 0;
          const currentProgress = Number(ajo.currentCycleProgress || ajo.currentStep) || 1;
          const calculatedPercent = totalDuration > 0
            ? Math.min(Math.round((currentProgress / totalDuration) * 100), 100)
            : 0;

          const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
          return {
            name: ajo.name || ajo.groupName,
            amount: ajo.amount || ajo.contributionAmount,
            frequency: ajo.cycleType || "weekly",
            members: ajo.contributors?.length || 0,
            currentProgress,
            total: totalDuration,
            percent: calculatedPercent,
            color: colors[Math.floor(Math.random() * colors.length)]
          };
        });
        setActiveAjos(formattedAjos);

      } catch (err) {
        console.error('❌ UI calculation processing fault:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardFinancialsAndAjos();
    }
  }, [user?.id]);

  return (
    <div className="dashboard-root">
     <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div className="user-info">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase() ?? "A"}</div>
            <div className="greeting">
              <div className="greeting-sub">Welcome 🙂</div>
              <div className="greeting-name">{user?.name}</div>
            </div>
          </div>

          <button className="create-btn" onClick={() => navigate("/creategroup")}>
            <Icon name="plus" size={16} color="#fff" />
            Create Ajo Group
          </button>

          <div className="header-right">
            <button className="bell-btn">
              <Icon name="bell" size={18} color="#6b7280" />
            </button>
          </div>
        </header>

        <main className="dashboard-main">
          <div className="row-1">
            <div className="wallet-card">
              <div>
                <div className="wallet-label">Wallet Balance</div>
                <div className="wallet-balance-row">
                  <div className="wallet-amount">
                    {showBalance
                      ? `₦${walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
                      : "₦ ••••••"}
                  </div>
                  <button className="eye-btn" onClick={() => setShowBalance(!showBalance)}>
                    <Icon name="eye" size={18} color="rgba(255,255,255,0.7)" />
                  </button>
                </div>
                <div className="wallet-actions">
                  <button className="wallet-action-btn" onClick={() => { navigate("/sendpayout") }}>
                    <Icon name="arrowUp" size={15} color="#fff" />
                    PayOut
                  </button>
                </div>
              </div>
            </div>

            <div className="payout-card">
              <div>
                <div className="payout-label">Next Payout</div>
                <div className="payout-sub">You are next to receive</div>
                <div className="payout-amount">
                  ₦{nextPayout.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </div>
                <div className="payout-date">
                  {nextPayout.date !== "—" ? `On ${nextPayout.date}` : "No payout scheduled yet"}
                </div>
              </div>
              <button className="view-details-btn" onClick={() => navigate("/payout")}>
                View Details
                <Icon name="arrowRight" size={16} color="#16a34a" />
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <StatCard icon="ajo" label="Active Ajo" value={stats.activeAjo} sub="View all" />
            <StatCard icon="check" label="Completed Ajo" value={stats.completedAjo} sub="View all" />
            <StatCard
              icon="chart"
              label="Total Contributions"
              value={`₦${stats.totalContributions.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`}
              sub="View details"
            />
            <StatCard
              icon="wallet"
              label="Total Payouts"
              value={`₦${stats.totalPayouts.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`}
              sub="View details"
            />
          </div>

          <div className="bottom-grid">
            <div className="panel-card">
              <div className="panel-header">
                <span className="panel-title">My Active Ajo</span>
                {activeAjos.length > 0 && (
                  <button className="panel-view-all" onClick={() => navigate("/all-ajo-groups")}>View all</button>
                )}
              </div>
              {loading ? (
                <LoadingSpinner />
              ) : activeAjos.length === 0 ? (
                <EmptyState icon="group" message="No active Ajo groups yet." />
              ) : (
                activeAjos.slice(0, 4).map((ajo, i) => <AjoRow key={i} {...ajo} />)
              )}
            </div>

            <div className="panel-card">
              <div className="panel-header">
                <span className="panel-title">Recent Incoming Contributions</span>
                {transactions.length > 0 && (
                  <button className="panel-view-all" onClick={() => navigate("/transaction") }>View all</button>
                )}
              </div>
              {transactions.length === 0 ? (
                <EmptyState icon="transactions" message="No collection logs recorded yet." />
              ) : (
                transactions.slice(0, 5).map((tx, i) => <TxRow key={i} {...tx} />)
              )}
            </div>
          </div>

          <div className="bottom-grid" style={{ marginTop: '24px' }}>
            <div className="panel-card" style={{ width: '100%', gridColumn: 'span 2' }}>
              <div className="panel-header">
                <span className="panel-title">Recent Distributed Payouts</span>
              </div>
              {payoutTransactions.length === 0 ? (
                <EmptyState icon="wallet" message="No distribution payouts processed from this portal yet." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {payoutTransactions.map((tx, i) => (
                    <TxRow key={i} {...tx} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <BottomNav/>
    </div>
  );
}