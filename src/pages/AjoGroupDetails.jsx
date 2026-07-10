import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authContext } from "../Context/authcontext";
import { privateInstance } from "../api/api";
import "./AjoGroupDetails.css";

// ── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    arrowLeft: <polyline points="15 18 9 12 15 6" />,
    group: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    wallet: <><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><circle cx="16" cy="14" r="2" /></>,
    info: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
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

// ── Loading Spinner ─────────────────────────────────────────────────────────
const LoadingSpinner = () => (
  <div className="loading-state">
    <div className="spinner">
      <div className="spinner-ring"></div>
    </div>
    <p className="loading-text">Loading group details...</p>
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

// ── Member Card ──────────────────────────────────────────────────────────────
const MemberCard = ({ name, phone, address, contribution }) => (
  <div className="member-card">
    <div className="member-avatar">
      {name?.charAt(0).toUpperCase() || "C"}
    </div>
    <div className="member-info">
      <div className="member-name">{name || "Unknown Contributor"}</div>
      <div className="member-phone">Phone: {phone || "N/A"}</div>
      {address && <div className="member-address">Address: {address}</div>}
    </div>
    {contribution && (
      <div className="member-contribution">₦{contribution.toLocaleString()}</div>
    )}
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
export default function AjoGroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(authContext);

  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch Group Details ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await privateInstance.get(`/creategroup/${groupId}`);

        console.log("Group Details Response:", response.data);
        setGroupData(response.data);
      } catch (err) {
        console.error('Failed to fetch group details:', err);
        setError(err.message || "Failed to load group details");
        setGroupData(null);
      } finally {
        setLoading(false);
      }
    };

    if (groupId && user?.id) {
      fetchGroupDetails();
    }
  }, [groupId, user?.id]);

  if (loading) {
    return (
      <div className="details-root">
        <header className="details-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <Icon name="arrowLeft" size={20} color="#6b7280" />
          </button>
          <h1 className="header-title">Group Details</h1>
          <div className="header-spacer" />
        </header>
        <main className="details-main">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (error || !groupData) {
    return (
      <div className="details-root">
        <header className="details-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <Icon name="arrowLeft" size={20} color="#6b7280" />
          </button>
          <h1 className="header-title">Group Details</h1>
          <div className="header-spacer" />
        </header>
        <main className="details-main">
          <EmptyState
            icon="info"
            message={error || "Group details could not be loaded."}
          />
        </main>
      </div>
    );
  }

  const {
    name = "Unnamed Group",
    amount = 0,
    cycleType = "weekly",
    cycleDuration = 52,
    contributors = contributors || [],
    description = "No description provided",
    currentCycleProgress = 0,
  } = groupData.group || groupData;

  const percent = Math.round((currentCycleProgress / cycleDuration) * 100) || 10;

  return (
    <div className="details-root">
      {/* ── Header ── */}
      <header className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <Icon name="arrowLeft" size={20} color="#6b7280" />
        </button>
        <h1 className="header-title">{name}</h1>
        <div className="header-spacer" />
      </header>

      {/* ── Main Content ── */}
      <main className="details-main">
        {/* ── Hero Card ── */}
        <div className="hero-card">
          <div className="hero-icon">
            <Icon name="group" size={40} color="#16a34a" />
          </div>
          <div className="hero-content">
            <h2 className="group-name">{name}</h2>
            <p className="group-description">{description}</p>
          </div>
        </div>

        {/* ── Key Stats Grid ── */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Contribution Amount</div>
            <div className="stat-value">₦{amount.toLocaleString()}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Cycle Type</div>
            <div className="stat-value">{cycleType}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Total Duration</div>
            <div className="stat-value">{cycleDuration} weeks</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Members</div>
            <div className="stat-value">{contributors?.length || 0}</div>
          </div>
        </div>

        {/* ── Progress Section ── */}
        <div className="progress-section">
          <div className="progress-header">
            <h3>Cycle Progress</h3>
            <span className="progress-percent">{percent}%</span>
          </div>
          <ProgressBar percent={percent} />
          <div className="progress-info">
            Week {currentCycleProgress || 1} of {cycleDuration}
          </div>
        </div>

        {/* ── Members Section ── */}
        <div className="members-section">
          <h3 className="section-title">Members ({contributors?.length || 0})</h3>
          <div className="members-list">
            {contributors && contributors.length > 0 ? (
              contributors.map((member, idx) => (
                <MemberCard
                  key={idx}
                  name={member.name}
                  phone={member.phone}
                  address={member.address}
                  contribution={member.totalContribution}
                />
              ))
            ) : (
              <EmptyState
                icon="users"
                message="No members in this group yet."
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
