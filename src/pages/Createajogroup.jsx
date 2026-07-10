import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import BottomNav from "../Component/BottomNav";
import Icon from "../Component/Icon";
import "./Createajogroup.css";
import { privateInstance } from "../api/api";

// ── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ current, total }) => (
  <div className="step-indicator">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className={`step-dot ${i < current ? "done" : i === current ? "active" : ""}`}
      />
    ))}
  </div>
);

// ── Field Wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, required, children }) => (
  <div className="cg-field">
    <label className="cg-label">
      {label}
      {required && <span className="cg-required"> *</span>}
    </label>
    {children}
  </div>
);

// ── Review Row ───────────────────────────────────────────────────────────────
const ReviewRow = ({ label, value, green }) => (
  <div className="review-row">
    <span className="review-key">{label}</span>
    <span className={`review-val ${green ? "green" : ""}`}>{value}</span>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
export default function CreateGroup() {
  const navigate = useNavigate();
  const { groupId } = useParams(); // For edit mode
  const isEditMode = !!groupId;
  const TOTAL_STEPS = isEditMode ? 2 : 3; // Review step combined with members for edit mode

  // ── Step state ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);

  // ── Step 1 form state ───────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    cycleType: "daily",
    amount: "",
    cycleDuration: "",
    startDate: "",
    description: "",
    commissionPercentage: "",
  });
  const [errors, setErrors] = useState({});

  // ── Step 2 state (Now stores full raw object list) ─────────────────────────
  const [search, setSearch] = useState("");
  const [showAddNew, setShowAddNew] = useState(false);
  const [newContrib, setNewContrib] = useState({ name: "", phone: "", address: "" });
  const [contributorsList, setContributorsList] = useState([]); // Array of raw user data objects

  // ── Step 3 / submit state ───────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Load existing group data if in edit mode ────────────────────────────────
  useEffect(() => {
    if (isEditMode && groupId) {
      const fetchGroupData = async () => {
        try {
          setLoading(true);
          setLoadError(null);
          const response = await privateInstance.get(`/creategroup/${groupId}`);

          const groupData = response.data.group || response.data;

          // Populate form with existing data
          setForm({
            name: groupData.name || "",
            cycleType: groupData.cycleType || "daily",
            amount: groupData.amount?.toString() || "",
            cycleDuration: groupData.cycleDuration?.toString() || "",
            startDate: groupData.startDate ? new Date(groupData.startDate).toISOString().split('T')[0] : "",
            description: groupData.description || "",
          });

          // Pre-populate contributors array list straight from backend array items
          setContributorsList(groupData.contributors || []);
        } catch (err) {
          console.error("Failed to load group:", err);
          setLoadError(err.message || "Failed to load group details");
        } finally {
          setLoading(false);
        }
      };

      fetchGroupData();
    }
  }, [groupId, isEditMode]);

  // Filter local contributors array by search inputs
  const filteredContributors = contributorsList.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || "").includes(search)
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const cycleLabels = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

  const expectedPerCycle = () => {
    const amt = parseFloat(form.amount) || 0;
    return (amt * contributorsList.length).toLocaleString("en-NG", { minimumFractionDigits: 2 });
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Group name is required";
    if (!form.amount) e.amount = "Amount is required";
    if (!form.cycleDuration) e.cycleDuration = "Duration is required";
    else if (isNaN(form.cycleDuration) || +form.cycleDuration <= 0) e.cycleDuration = "Enter a valid number";
    else if (isNaN(form.amount) || +form.amount <= 0) e.amount = "Enter a valid amount";
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.commissionAmount || form.commissionAmount === "") e.commissionAmount = "Commission amount is required";
    else if (isNaN(form.commissionAmount) || +form.commissionAmount < 0) e.commissionAmount = "Enter a valid commission amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    if (contributorsList.length === 0) {
      setErrors({ contributors: "Add at least one contributor to this group" });
      return false;
    }
    setErrors({});
    return true;
  };

  // ── Save full contributor info blocks to local state ───────────────────────
  const handleAddNewContrib = () => {
    const e = {};
    if (!newContrib.name.trim()) e.newName = "Name is required";
    if (!newContrib.phone.trim()) e.newPhone = "Phone is required";
    if (Object.keys(e).length) { setErrors(e); return; }

    const fresh = {
      name: newContrib.name.trim(),
      phone: newContrib.phone.trim(),
      address: newContrib.address.trim() || ""
    };

    setContributorsList(prev => [...prev, fresh]);
    setNewContrib({ name: "", phone: "", address: "" });
    setShowAddNew(false);
    setErrors({});
  };

  // ── Delete entry from array local list ─────────────────────────────────────
  const removeContributor = (indexToRemove) => {
    setContributorsList(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    setErrors({});
    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 0) navigate(-1);
    else { setErrors({}); setStep(s => s - 1); }
  };

  // ── Submit → Array of direct Data objects sent clean to backend ────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        cycleType: form.cycleType,
        amount: +form.amount,
        cycleDuration: +form.cycleDuration,
        startDate: form.startDate,
        description: form.description,
        contributors: contributorsList, // Transmitting complete structured objects
        commissionAmount: +form.commissionAmount,
      };

      let res;
      if (isEditMode) {
        res = await privateInstance.put(`/creategroup/${groupId}`, payload);
      } else {
        res = await privateInstance.post("/creategroup", payload);
      }

      if (res.data?.group?._id) {
        const groupId = res.data.group._id;

        // Create commission record for the group
        try {
          await privateInstance.post(`/api/commissions/group/${groupId}`, {
            commissionAmount: +form.commissionAmount,
          });
          console.log("✅ Commission created successfully");
        } catch (commErr) {
          console.warn("⚠️ Commission creation failed:", commErr);
        }
      }

      if (res.data.success || res.status === 200 || res.status === 201) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err.response?.data?.message || err.message || "An error occurred");
      setErrors({ submit: err.response?.data?.message || "Failed to save group" });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="cg-root">
        <Sidebar />
        <div className="cg-main">
          <div className="cg-success">
            <div className="success-icon">
              <Icon name="checkCircle" size={52} color="#16a34a" />
            </div>
            <h2 className="success-title">{isEditMode ? "Group Updated!" : "Group Created!"}</h2>
            <p className="success-sub">
              <strong>{form.name}</strong> successfully saved with {contributorsList.length} contributor{contributorsList.length !== 1 ? "s" : ""}.
            </p>
            <button className="cg-btn-primary" onClick={() => navigate("/all-ajo-groups")}>
              View My Groups
            </button>
            <button className="cg-btn-ghost" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Loading State ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="cg-root">
        <Sidebar />
        <div className="cg-main">
          <div className="cg-loading">
            <div className="spinner"><div className="spinner-ring"></div></div>
            <p>Loading group details...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="cg-root">
        <Sidebar />
        <div className="cg-main">
          <div className="cg-error">
            <div className="error-icon"><Icon name="alertCircle" size={52} color="#ef4444" /></div>
            <h2>Error Loading Group</h2>
            <p>{loadError}</p>
            <button className="cg-btn-primary" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const durationLabels = {
    daily: "How many days?",
    weekly: "How many weeks?",
    monthly: "How many months?",
  };

  return (
    <div className="cg-root">
      <Sidebar />

      <div className="cg-main">
        {/* ── Page Header ── */}
        <div className="cg-page-header">
          <button className="cg-back-btn" onClick={handleBack}>
            <Icon name="arrowLeft" size={18} color="#ffffff" />
            <span>Back</span>
          </button>
          <div className="cg-header-center">
            <h1 className="cg-page-title">{isEditMode ? "Edit Ajo Group" : "Create Ajo Group"}</h1>
            <p className="cg-step-label">
              Step {step + 1} of {TOTAL_STEPS} —{" "}
              {isEditMode
                ? ["Group details", "Contributors & review"][step]
                : ["Group details", "Add contributors", "Review & create"][step]
              }
            </p>
          </div>
          <div style={{ width: 80 }} />
        </div>

        {/* ── Step Progress Bar ── */}
        <div className="cg-progress-wrap">
          <StepIndicator current={step} total={TOTAL_STEPS} />
        </div>

        {/* ── Content ── */}
        <div className="cg-content">

          {/* ════════════ STEP 1 — Group Details ════════════ */}
          {step === 0 && (
            <div className="cg-step">
              <div className="cg-step-intro">
                <h2 className="cg-step-title">Group details</h2>
                <p className="cg-step-sub">Set up your Ajo group information</p>
              </div>

              <div className="cg-form">
                <Field label="Group name" required>
                  <input
                    className={`cg-input ${errors.name ? "error" : ""}`}
                    type="text"
                    placeholder="e.g. Balogun Market Group"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <span className="cg-error">{errors.name}</span>}
                </Field>

                <Field label="Contribution cycle" required>
                  <div className="cycle-options">
                    {["daily", "weekly", "monthly"].map(c => (
                      <button
                        key={c}
                        className={`cycle-btn ${form.cycleType === c ? "active" : ""}`}
                        onClick={() => setForm({ ...form, cycleType: c })}
                      >
                        {cycleLabels[c]}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label={`Amount per ${form.cycleType} (₦)`} required>
                  <div className="cg-input-prefix-wrap">
                    <span className="cg-prefix">₦</span>
                    <input
                      className={`cg-input with-prefix ${errors.amount ? "error" : ""}`}
                      type="number"
                      placeholder="500"
                      min="1"
                      value={form.amount}
                      onChange={e => setForm({ ...form, amount: e.target.value })}
                    />
                  </div>
                  {errors.amount && <span className="cg-error">{errors.amount}</span>}
                </Field>

                <Field label={durationLabels[form.cycleType]} required>
                  <input
                    className={`cg-input ${errors.cycleDuration ? "error" : ""}`}
                    type="number"
                    placeholder={form.cycleType === "daily" ? "e.g. 30" : form.cycleType === "weekly" ? "e.g. 4" : "e.g. 12"}
                    value={form.cycleDuration}
                    onChange={e => setForm({ ...form, cycleDuration: e.target.value })}
                  />
                  {errors.cycleDuration && <span className="cg-error">{errors.cycleDuration}</span>}
                </Field>

                <Field label="Start date" required>
                  <input
                    className={`cg-input ${errors.startDate ? "error" : ""}`}
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                  />
                  {errors.startDate && <span className="cg-error">{errors.startDate}</span>}
                </Field>

                <Field label="Commission Amount (₦)" required>
                  <div className="cg-input-prefix-wrap">
                    <span className="cg-prefix">₦</span>
                    <input
                      className={`cg-input with-prefix ${errors.commissionAmount ? "error" : ""}`}
                      type="number"
                      placeholder="e.g. ₦1000"
                      min="0"
                      max="10000"
                      step="0.5"
                      value={form.commissionAmount}
                      onChange={e => setForm({ ...form, commissionAmount: e.target.value })}
                    />
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
                    This is how much you earn from each contribution
                  </p>
                  {errors.commissionAmount && <span className="cg-error">{errors.commissionAmount}</span>}
                </Field>

                <Field label="Description (optional)">
                  <textarea
                    className="cg-textarea"
                    placeholder="Add a short note about this group…"
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* ════════════ STEP 2 — Manage Contributors ════════════ */}
          {step === 1 && (
            <div className="cg-step">
              <div className="cg-step-intro">
                <h2 className="cg-step-title">Contributors</h2>
                <p className="cg-step-sub">Manage the contributors under your collection</p>
              </div>

              {/* Contributors list section */}
              <div className="current-members-section">
                <h3 className="members-section-title">Contributors Added ({contributorsList.length})</h3>

                {errors.contributors && (
                  <div className="cg-alert" style={{ marginBottom: "15px" }}>
                    <Icon name="alertCircle" size={15} color="#ef4444" />
                    {errors.contributors}
                  </div>
                )}

                <div className="current-members-list">
                  {contributorsList.length > 0 ? (
                    contributorsList.map((c, idx) => (
                      <div key={idx} className="member-row">
                        <div className="member-avatar">
                          {(c.name?.charAt(0) || "C").toUpperCase()}
                        </div>
                        <div className="member-details">
                          <div className="member-name">{c.name}</div>
                          <div className="member-phone">
                            {c.phone} {c.address ? ` · ${c.address}` : ""}
                          </div>
                        </div>
                        <button
                          className="member-remove-btn"
                          onClick={() => removeContributor(idx)}
                          title="Remove contributor"
                        >
                          <Icon name="x" size={16} color="#ef4444" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="cg-empty-search" style={{ padding: "10px 0" }}>No contributors added yet.</p>
                  )}
                </div>
              </div>

              {/* Local Search input bar */}
              {contributorsList.length > 0 && (
                <div className="cg-search-wrap" style={{ marginTop: "20px" }}>
                  <Icon name="search" size={16} color="#9ca3af" />
                  <input
                    className="cg-search"
                    type="text"
                    placeholder="Filter added list by name or phone…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              )}

              {/* Filtered Search view list matches layout values */}
              {search && (
                <div className="contrib-list" style={{ maxHeight: "150px", overflowY: "auto", margin: "10px 0" }}>
                  {filteredContributors.map((c, idx) => (
                    <div key={idx} className="contrib-item" style={{ cursor: "default" }}>
                      <div className="contrib-info">
                        <div className="contrib-name">{c.name}</div>
                        <div className="contrib-meta">{c.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="cg-divider"><span>Add Contributor Profile</span></div>

              {/* Add New inline fields block */}
              {!showAddNew ? (
                <button className="add-new-btn" onClick={() => setShowAddNew(true)}>
                  <Icon name="plus" size={17} color="#16a34a" />
                  Add contributor details
                </button>
              ) : (
                <div className="add-new-form" style={{ marginTop: "10px" }}>
                  <div className="add-new-header">
                    <span className="add-new-title">New Contributor Details</span>
                    <button className="add-new-close" onClick={() => { setShowAddNew(false); setErrors({}); }}>
                      <Icon name="x" size={16} color="#6b7280" />
                    </button>
                  </div>
                  <div className="cg-form">
                    <Field label="Full name" required>
                      <input
                        className={`cg-input ${errors.newName ? "error" : ""}`}
                        type="text"
                        placeholder="e.g. Baba Tunde"
                        value={newContrib.name}
                        onChange={e => setNewContrib({ ...newContrib, name: e.target.value })}
                      />
                      {errors.newName && <span className="cg-error">{errors.newName}</span>}
                    </Field>
                    <Field label="Phone number" required>
                      <input
                        className={`cg-input ${errors.newPhone ? "error" : ""}`}
                        type="tel"
                        placeholder="e.g. 08031234567"
                        value={newContrib.phone}
                        onChange={e => setNewContrib({ ...newContrib, phone: e.target.value })}
                      />
                      {errors.newPhone && <span className="cg-error">{errors.newPhone}</span>}
                    </Field>
                    <Field label="Address / Shop Description (optional)">
                      <input
                        className="cg-input"
                        type="text"
                        placeholder="e.g. Shop 24, Balogun Market"
                        value={newContrib.address}
                        onChange={e => setNewContrib({ ...newContrib, address: e.target.value })}
                      />
                    </Field>
                    <button className="cg-btn-primary" onClick={handleAddNewContrib}>
                      Save to Local List
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════ STEP 3 — Review ════════════ */}
          {step === 2 && (
            <div className="cg-step">
              <div className="cg-step-intro">
                <h2 className="cg-step-title">Review your group</h2>
                <p className="cg-step-sub">Confirm everything looks right</p>
              </div>

              <div className="review-card">
                <ReviewRow label="Group name" value={form.name} />
                <ReviewRow label="Cycle" value={cycleLabels[form.cycleType]} />
                <ReviewRow label="Cycle duration" value={`${form.cycleDuration} ${form.cycleType === "daily" ? "days" : form.cycleType === "weekly" ? "weeks" : "months"}`} />
                <ReviewRow label="Amount per cycle" value={`₦${parseFloat(form.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })} / ${form.cycleType}`} />
                <ReviewRow label="Start date" value={new Date(form.startDate).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })} />
                <ReviewRow label="Contributors count" value={`${contributorsList.length} clients added`} />
                <ReviewRow label="Expected / cycle" value={`₦${expectedPerCycle()} / ${form.cycleType}`} green />
                {form.description && <ReviewRow label="Description" value={form.description} />}
              </div>

              <div className="review-contributors">
                <p className="review-section-label">Contributors Summary ({contributorsList.length})</p>
                <div className="review-chips">
                  {contributorsList.map((c, idx) => {
                    const initials = (c.name || "C").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <div key={idx} className="review-chip">
                        <div className="review-chip-avatar">{initials}</div>
                        <span>{(c.name || "").split(" ")[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="review-hint">
                <Icon name="edit" size={13} color="#9ca3af" /> Go back to make changes before creating
              </p>
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="cg-actions">
            {step < TOTAL_STEPS - 1 ? (
              <button className="cg-btn-primary" onClick={handleNext}>
                Continue
                <Icon name="arrowRight" size={16} color="#fff" />
              </button>
            ) : (
              <button
                className={`cg-btn-primary ${submitting ? "loading" : ""}`}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner" />
                    Saving group…
                  </>
                ) : (
                  <>
                    <Icon name="checkCircle" size={16} color="#fff" />
                    {isEditMode ? "Update Group" : "Create Group"}
                  </>
                )}
              </button>
            )}
            {step > 0 && (
              <button className="cg-btn-ghost" onClick={handleBack}>
                Back
              </button>
            )}
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}