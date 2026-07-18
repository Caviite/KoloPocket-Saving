import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ArrowLeft,
  Users,
  Percent,
  Coins,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { privateInstance } from "../api/api";
import Sidebar from "../Component/Sidebar";
import BottomNav from "../Component/BottomNav";
import "./Commission.css";

const ThreeDotLoader = ({ label = "Loading" }) => (
  <div className="comm-three-dot-loader" role="status" aria-live="polite" aria-label={label}>
    <span />
    <span />
    <span />
  </div>
);

const MetricCard = ({ icon: IconComponent, title, value, label, isLoading = false }) => (
  <div className="comm-metric-card">
    <div className="comm-metric-icon-box">
      <IconComponent size={20} color="#16a34a" />
    </div>
    <div className="comm-metric-content">
      <span className="comm-metric-title">{title}</span>
      {isLoading ? (
        <div className="comm-metric-loader-wrap">
          <ThreeDotLoader label={`Loading ${title}`} />
        </div>
      ) : (
        <>
          <h3 className="comm-metric-value">{value}</h3>
          <span className="comm-metric-label">{label}</span>
        </>
      )}
    </div>
  </div>
);

export default function CommissionDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Database state mappings
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [commissionsList, setCommissionsList] = useState([]);

  // ── UPDATED STATS: Swapped out percentage averages for aggregate flat rules ──
  const stats = React.useMemo(() => {
    let totalCollectedSum = 0;
    let totalPayoutsDistributedSum = 0;
    let totalFixedCommissionRulesSum = 0;

    commissionsList.forEach((c) => {
      totalCollectedSum += c.totalCollected || 0;
      totalPayoutsDistributedSum += c.totalPayoutsDistributed || 0;
      totalFixedCommissionRulesSum += c.commissionAmount || 0; // Using flat amount from schema
    });

    return {
      activeGroups: commissionsList.length || 0,
      flatFeeBaseline: `₦${totalFixedCommissionRulesSum.toLocaleString()}`,
      totalCollected: `₦${totalCollectedSum.toLocaleString()}`,
      payoutsDistributed: `₦${totalPayoutsDistributedSum.toLocaleString()}`,
    };
  }, [commissionsList]);

  const dynamicChartData = React.useMemo(() => {
    if (commissionsList.length === 0) {
      return [
        { name: "Jan", earnings: 0 }, { name: "Feb", earnings: 0 },
        { name: "Mar", earnings: 0 }, { name: "Apr", earnings: 0 },
        { name: "May", earnings: 0 }, { name: "Jun", earnings: 0 }
      ];
    }
    return commissionsList.map((c, i) => ({
      name: c.groupId?.name ? c.groupId.name.substring(0, 6) + "..." : `Grp ${i + 1}`,
      earnings: c.totalCommissionEarned || 0,
    }));
  }, [commissionsList]);

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        setLoading(true);
        const response = await privateInstance.get("api/commissions/myearnings");

        if (response.data && response.data.success) {
          setTotalEarnings(response.data.totalEarnings || 0);
          setCommissionsList(response.data.commissions || []);
        }
      } catch (err) {
        console.error("Error connecting to endpoints:", err);
        setError(err.response?.data?.message || "Failed to load database values.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommissionData();
  }, []);

  return (
    <div className="comm-dashboard-root">
      {/* Sidebar - Desktop Layout Injection */}
      <div className="comm-sidebar-desktop-wrapper">
        <Sidebar />
      </div>

      {/* Main Workspace */}
      <div className="comm-main-container">
        <header className="comm-top-header">
          <div className="comm-header-title-block">
            <h2>Commission Dashboard</h2>
            <p>Track earnings from all your savings groups</p>
          </div>
          <button className="comm-pill-back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} color="#16a34a" />
            <span>Back</span>
          </button>
        </header>

        {error && (
          <div className="comm-error-notification">
            <p>{error}</p>
          </div>
        )}

        <>
          {/* Main Stats Card Section */}
          <section className="comm-hero-banner-card">
            <div className="comm-hero-left-content">
              <span className="comm-hero-label-sub">Total Commission Earned</span>
              {loading ? (
                <div className="comm-hero-loading-state">
                  <ThreeDotLoader label="Loading commission totals" />
                </div>
              ) : (
                <>
                  <h1 className="comm-hero-payout-display">₦{totalEarnings.toLocaleString()}</h1>
                  <div className="comm-hero-badge-growth">
                    <TrendingUp size={14} color="#16a34a" />
                    <span>Dynamic platform yields active</span>
                  </div>
                </>
              )}
            </div>

            <div className="comm-hero-wallet-illustration">
              <div className="comm-illust-glow-ring"></div>
              <div className="comm-illust-card-back"></div>
              <div className="comm-illust-card-front">
                <span className="comm-illust-chip"></span>
                <div className="comm-illust-currency-symbol">₦</div>
              </div>
            </div>
          </section>

          {/* Platform Metrics Data Row */}
          <section className="comm-stats-grid-row">
            <MetricCard icon={Users} title="Groups Active" value={stats.activeGroups} label="Active savings pools" isLoading={loading} />
            <MetricCard icon={Percent} title="Flat Fee Target" value={stats.flatFeeBaseline} label="Combined active base layout fees" isLoading={loading} />
            <MetricCard icon={Coins} title="Total Collected" value={stats.totalCollected} label="Total processed contributions" isLoading={loading} />
            <MetricCard icon={ArrowUpRight} title="Payouts Distributed" value={stats.payoutsDistributed} label="Disbursed group balances" isLoading={loading} />
          </section>

          {/* Content Split Column System */}
          <div className="comm-split-data-grid">

            {/* Dynamic Commission By Group Panel Content */}
            <div className="comm-panel-card-box">
              <div className="comm-panel-card-header">
                <h3>Commission by Group</h3>
                <button className="comm-action-link-btn" onClick={() => navigate("/all-ajo-groups")}>View All</button>
              </div>

              <div className="comm-panel-list-stack">
                {loading ? (
                  <>
                    <div className="comm-panel-loading-row">
                      <ThreeDotLoader label="Loading groups" />
                    </div>
                    <div className="comm-panel-loading-row">
                      <ThreeDotLoader label="Loading groups" />
                    </div>
                  </>
                ) : commissionsList.length === 0 ? (
                  <div className="comm-empty-records-slate">
                    <p>No Ajo savings group distributions recorded yet on this account.</p>
                  </div>
                ) : (
                  commissionsList.map((comm) => {
                    const groupInfo = comm.groupId || {};
                    const nameString = groupInfo.name || "Unnamed Group";
                    const initials = nameString.substring(0, 2).toUpperCase();

                    return (
                      <div key={comm._id} className="comm-group-row-item" onClick={() => navigate(`/all-ajo-groups`)}>
                        <div className="comm-avatar-circle">
                          {initials}
                        </div>
                        <div className="comm-row-details">
                          <h4>{nameString}</h4>
                          <span>{groupInfo.cycleType || "Flexible"} Cycle</span>
                        </div>
                        <div className="comm-row-financials">
                          <span className="comm-row-amount-label">₦{(comm.totalCommissionEarned || 0).toLocaleString()}</span>
                          <span className="comm-row-percent-badge">₦{(comm.commissionAmount || 0).toLocaleString()} fee</span>
                        </div>
                        <ChevronRight size={16} className="comm-list-arrow-icon" />
                      </div>
                    );
                  })
                )}
              </div>

              <button className="comm-panel-footer-btn" onClick={() => navigate("/all-ajo-groups")} disabled={loading}>
                <Percent size={14} color="#16a34a" />
                <span>View All Groups</span>
              </button>
            </div>

            {/* Chart Visualization Dynamic Rendering */}
            <div className="comm-panel-card-box">
              <div className="comm-panel-card-header">
                <h3>Commission Trends</h3>
                <span className="comm-chart-inline-indicator-badge">Live Metrics</span>
              </div>

              <div className="comm-recharts-container-frame">
                {loading ? (
                  <div className="comm-chart-loading-state">
                    <ThreeDotLoader label="Loading trends" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="commChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card-bg)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-primary)",
                          borderRadius: "12px"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="#16a34a"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#commChartGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="comm-chart-aggregate-footer">
                <span>Aggregated Earnings Summary</span>
                {loading ? (
                  <div className="comm-chart-footer-loader">
                    <ThreeDotLoader label="Loading summary" />
                  </div>
                ) : (
                  <h4>₦{totalEarnings.toLocaleString()}</h4>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Interaction Display Box */}
          <section className="comm-cta-banner-card">
            <div className="comm-cta-icon-decorator">
              <Sparkles size={24} color="#16a34a" />
            </div>
            <div className="comm-cta-text-block">
              {loading ? (
                <div className="comm-cta-loading-state">
                  <ThreeDotLoader label="Preparing action card" />
                </div>
              ) : (
                <>
                  <h3>Keep growing your groups!</h3>
                  <p>More groups and consistent contributions mean higher platform processing records and increased commission payouts.</p>
                </>
              )}
            </div>
            <button className="comm-cta-trigger-btn" onClick={() => navigate("/creategroup")} disabled={loading}>
              <Plus size={16} color="#ffffff" />
              <span>Create New Group</span>
            </button>
          </section>
        </>
      </div>

      {/* Mobile Layout Target Injection Override */}
      <div className="comm-bottom-nav-mobile-wrapper">
        <BottomNav />
      </div>
    </div>
  );
}