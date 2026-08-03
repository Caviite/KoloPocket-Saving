import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../Context/authcontext";
import { privateInstance } from "../api/api";
import Sidebar from "../Component/Sidebar";
import BottomNav from "../Component/BottomNav";
import Icon from "../Component/Icon";
import "./Transaction.css";

// ── Reusable Component exactly matching Dashboard ──
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

const EmptyState = ({ icon, message }) => (
  <div className="empty-state">
    <div className="empty-icon-wrap">
      <Icon name={icon} size={24} color="#86efac" />
    </div>
    <p className="empty-text">{message}</p>
  </div>
);

export default function Transactions() {
  const navigate = useNavigate();
  const { user } = useContext(authContext);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);

        // 1. Fetch user's Ajo groups matching dashboard logic
        const response = await privateInstance.get('/creategroup/getMyGroups');
        const groupData = response.data?.groups || response.data || [];

        let allTransactions = [];

        // 2. Loop groups to gather the full contributions ledger
        for (const group of groupData) {
          try {
            // Fetch group contributions from your verified route structure
            const contribRes = await privateInstance.get(`/api/contributions/group/${group._id}`);

            if (contribRes.data && contribRes.data.contributions) {
              const contributions = contribRes.data.contributions;

              contributions.forEach(c => {
                let realContributorName = "";

                // 🌟 FIX: Extract the raw ID string from the database record
                const targetId = c.contributorId && typeof c.contributorId === 'object'
                  ? c.contributorId._id
                  : c.contributorId;

                // 🌟 FIX: Look up the contributor name straight from the group's local contributor schema array
                if (targetId && group.contributors) {
                  const matchedLocal = group.contributors.find(
                    (item) => String(item._id || item.id) === String(targetId)
                  );
                  if (matchedLocal) {
                    realContributorName = matchedLocal.name;
                  }
                }

                // Fallback to populated object name if the lookup above didn't find anything
                if (!realContributorName && c.contributorId && typeof c.contributorId === 'object') {
                  realContributorName = c.contributorId.name;
                }

                // Final safety fallback string
                if (!realContributorName) {
                  realContributorName = "Contributor";
                }

                allTransactions.push({
                  icon: "plus",
                  label: realContributorName,
                  sub: `Group: ${group.name}`,
                  amount: c.amount,
                  date: new Date(c.paymentDate || c.createdAt).toLocaleDateString("en-NG"),
                  rawDate: new Date(c.paymentDate || c.createdAt),
                  transactionRef: c.transactionRef || "",
                  status: c.status || "completed",
                  positive: true
                });
              });
            }
          } catch (groupErr) {
            console.warn(`⚠️ Error context for group ${group._id}:`, groupErr.message);
          }
        }

        // Sort completely by descending date order (latest logs first)
        allTransactions.sort((a, b) => b.rawDate - a.rawDate);
        setTransactions(allTransactions);

      } catch (error) {
        console.error("Error gathering transactions matrix:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id || user?._id) {
      fetchAllTransactions();
    }
  }, [user?.id, user?._id]);

  // ── Live Filters logic ──
  const filteredTransactions = transactions.filter((tx) => {
    const contributorName = tx.label.toLowerCase();
    const groupName = tx.sub.toLowerCase();
    const reference = tx.transactionRef.toLowerCase();
    const search = searchTerm.toLowerCase();

    return contributorName.includes(search) || groupName.includes(search) || reference.includes(search);
  });

  return (
    <div className="dashboard-root">
      <Sidebar activeNav="transactions" />

      <div className="main-content">
        <main className="tx-page-main">

          {/* ── Header Row ── */}
          <div className="tx-page-header">
            <button className="tx-back-btn" onClick={() => navigate(-1)}>
              <Icon name="chevronLeft" size={16} color="currentColor" />
              <span>Back</span>
            </button>
            <h1 className="tx-page-title">All Recent Transactions</h1>
            <div style={{ width: 36 }}></div>
          </div>

          {/* ── Search Input Box ── */}
          <div className="tx-search-container">
            <Icon name="search" size={18} className="tx-search-icon" />
            <input
              type="text"
              placeholder="Search groups or contributors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="tx-search-input"
            />
          </div>

          {/* ── Ledger Layout Panel ── */}
          <div className="panel-card tx-full-panel">
            <div className="tx-panel-info">
              <span className="tx-count">
                {filteredTransactions.length} {filteredTransactions.length === 1 ? "contribution record" : "contribution records"} listed
              </span>
            </div>

            {loading ? (
              <div className="tx-state-msg">Fetching transaction history matrix...</div>
            ) : filteredTransactions.length === 0 ? (
              <EmptyState icon="transactions" message="No matching contribution transactions found." />
            ) : (
              <div className="tx-rows-container">
                {filteredTransactions.map((tx, i) => (
                  <TxRow key={i} {...tx} />
                ))}
              </div>
            )}
          </div>

        </main>
      </div>

      <BottomNav activeNav="transactions" />
    </div>
  );
}