import { useState, useContext, useEffect } from "react";
import { authContext } from "../Context/authcontext";
import { useNavigate } from "react-router-dom";
import { privateInstance } from "../api/api";
import "./AllAjoGroups.css";
import BottomNav from "../Component/BottomNav";

// ── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    arrowLeft: <polyline points="15 18 9 12 15 6" />,
    group: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
    arrowRight: <polyline points="9 18 15 12 9 6" />,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ percent }) => (
  <div className="progress-track">
    <div className="progress-fill" style={{ width: `${percent}%` }} />
  </div>
);

// ── Ajo Row ──────────────────────────────────────────────────────────────────
const AjoRow = ({ id, name, amount, frequency, contributors, week, total, percent, color, onClick }) => (
  <div className="ajo-row" onClick={onClick}>
    <div className="ajo-icon-wrap" style={{ background: color + "22" }}>
      <Icon name="group" size={18} color={color} />
    </div>
    <div className="ajo-info">
      <div className="ajo-name">{name}</div>
      <div className="ajo-meta">
        ₦{amount.toLocaleString()} {frequency} · {contributors} members
      </div>
      <ProgressBar percent={percent} />
    </div>
    <div className="ajo-cycle">
      <div className="ajo-cycle-weeks">Week {week} of {total}</div>
      <div className="ajo-cycle-percent">{percent}%</div>
    </div>
    <div className="ajo-arrow">
      <Icon name="arrowRight" size={16} />
    </div>
  </div>
);

// ── Loading Spinner ─────────────────────────────────────────────────────────
const LoadingSpinner = () => (
  <div className="loading-state">
    <div className="spinner">
      <div className="spinner-ring"></div>
    </div>
    <p className="loading-text">Loading all Ajo groups...</p>
  </div>
);

// ── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon, message }) => (
  <div className="empty-state">
    <div className="empty-icon-wrap">
      <Icon name={icon} size={24} color="#86efac" />
    </div>
    <p className="empty-text">{message}</p>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
export default function AllAjoGroups() {
  const navigate = useNavigate();
  const { user } = useContext(authContext);

  const [activeAjos, setActiveAjos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ── Fetch All Active Ajos ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchActiveAjos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await privateInstance.get('/creategroup/getMyGroups');

        // Transform API response to match AjoRow component props
        const formattedAjos = response.data.groups.map(ajo => {
          // ── Cron Engine Progress Calculations ──
          const totalCycles = Number(ajo.cycleDuration || ajo.duration || ajo.totalCycles) || 12;
          const currentProgress = Number(ajo.currentCycleProgress ?? ajo.currentStep ?? ajo.currentCycle) || 0;

          const computedPercent = totalCycles > 0
            ? Math.min(Math.round((currentProgress / totalCycles) * 100), 100)
            : 0;

          return {
            id: ajo._id || ajo.id,
            name: ajo.name || ajo.groupName,
            amount: ajo.amount || ajo.contributionAmount,
            frequency: ajo.cycleType || "weekly",
            contributors: ajo.contributors?.length || 0,
            week: currentProgress || 1, // Falls back to 1 if progress hasn't started yet
            total: totalCycles,
            percent: computedPercent,
            color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
          };
        });

        setActiveAjos(formattedAjos);
      } catch (err) {
        console.error('Failed to fetch active ajos:', err);
        setError(err.message);
        setActiveAjos([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchActiveAjos();
    }
  }, [user?.id]);

  // ── Filter groups based on search ─────────────────────────────────────────
  const filteredAjos = activeAjos.filter(ajo =>
    ajo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="all-ajo-root">
      {/* ── Header ── */}
      <header className="all-ajo-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <Icon name="arrowLeft" size={20} color="#6b7280" />
            Back
          </button>
          <h1 className="header-title">All Active Ajo Groups</h1>
          <div className="header-spacer" />
        </div>

        {/* Search Bar */}
        {activeAjos.length > 0 && (
          <div className="search-container">
            <Icon name="search" size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search groups..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <main className="all-ajo-main">
        <div className="groups-panel">
          <div className="panel-info">
            <span className="group-count">
              {filteredAjos.length} group{filteredAjos.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <EmptyState
              icon="group"
              message="Failed to load Ajo groups. Please try again."
            />
          ) : filteredAjos.length === 0 ? (
            <EmptyState
              icon="group"
              message={searchTerm ? "No groups match your search." : "No active Ajo groups yet."}
            />
          ) : (
            <div className="ajo-list">
              {filteredAjos.map((ajo, i) => (
                <AjoRow
                  key={i}
                  {...ajo}
                  onClick={() => navigate(`/ajo-group-details/${ajo.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav activeNav="ajo" />
    </div>
  );
}
