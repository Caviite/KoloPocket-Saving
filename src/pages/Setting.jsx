import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import BottomNav from "../Component/BottomNav";
import Icon from "../Component/Icon";
import { authContext } from "../Context/authcontext";
import "./Setting.css";

export default function Settings() {
  const navigate = useNavigate();
  const { user, logOut } = useContext(authContext);

  // ── State (Theme persists smoothly on change) ───────────────────────────
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("kolo_theme") || "light";
  });
  
  const [alerts, setAlerts] = useState({
    push: true,
    email: true,
    sms: false,
  });
  const [transaction, setTransaction] = useState({
    dailyLimit: "50000",
    alertsEnabled: true,
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ── Theme Effect Engine (No logout or context distortion) ───────────────
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      // Auto / System Detection Mode
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
    }
    localStorage.setItem("kolo_theme", theme);
  }, [theme]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleAlertToggle = (type) => {
    setAlerts({
      ...alerts,
      [type]: !alerts[type],
    });
  };

  const handleTransactionChange = (field, value) => {
    setTransaction({
      ...transaction,
      [field]: value,
    });
  };

  const handleEditProfile = () => {
    console.log("Profile updated:", editData);
    setShowEditProfile(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setShowChangePassword(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      logOut();
      navigate("/auth");
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="main-content">
        <main className="settings-main">

          {/* ── Global Top Navigation Layout ── */}
          <div className="settings-global-header">
            <div className="header-titles-left">
              <h1 className="settings-page-title">Settings</h1>
              <p className="settings-page-subtitle">Manage your account and preferences</p>
            </div>

            <div className="header-utilities-right">
              <div className="utility-bell-wrapper">
                <Icon name="bell" size={20} color="var(--text-primary)" />
                <span className="bell-dot-indicator"></span>
              </div>

              <div className="utility-profile-dropdown">
                <div className="mini-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <span className="mini-profile-name">{user?.name || "Adebayo Ademola"}</span>
                <Icon name="chevronRight" size={14} color="var(--text-secondary)" style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>
          </div>

          {/* ── Premium Identity Banner Card ── */}
          <div className="green-profile-banner-card">
            <div className="banner-profile-details">
              <div className="banner-avatar-container">
                <div className="banner-main-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="avatar-camera-badge">
                  <Icon name="edit" size={12} color="#0B0F19" />
                </div>
              </div>

              <div className="banner-text-meta">
                <div className="banner-name-row">
                  <h3>{user?.name || "Adebayo Ademola"}</h3>
                  <span className="banner-verified-check">✓</span>
                </div>
              </div>
            </div>

            <button onClick={() => setShowEditProfile(!showEditProfile)} className="banner-edit-button">
              Edit Profile
            </button>
          </div>

          {/* ── Core Settings Control Grid Panel ── */}
          <div className="settings-content">

            {/* Profile Information */}
            <div className="settings-card">
              <div className="settings-card-header" onClick={() => setShowEditProfile(!showEditProfile)}>
                <Icon name="user" size={20} color="var(--brand-green)" />
                <div className="header-meta-text">
                  <h2 className="settings-card-title">Profile Information</h2>
                  <p className="card-desc-sub">Update your personal information</p>
                </div>
                <Icon name="chevronRight" size={18} color="var(--text-muted)" />
              </div>

              <div className="settings-card-body">
                <div className="settings-row">
                  <span className="settings-label">Full Name</span>
                  <span className="settings-value">{user?.name || "Adebayo Ademola"}</span>
                </div>
                <div className="settings-row">
                  <span className="settings-label">Email Address</span>
                  <span className="settings-value">{user?.email || "adebayo@email.com"}</span>
                </div>
                <div className="settings-row">
                  <span className="settings-label">Phone Number</span>
                  <span className="settings-value">{user?.phone || "+234 803 123 4567"}</span>
                </div>
                <div className="settings-row">
                  <span className="settings-label">Address</span>
                  <span className="settings-value">{user?.address || "—"}</span>
                </div>
              </div>

              {showEditProfile && (
                <div className="settings-form">
                  <div className="settings-form-header">
                    <span>Edit Your Profile</span>
                    <button className="settings-form-close" onClick={() => setShowEditProfile(false)}>
                      <Icon name="x" size={16} color="var(--text-muted)" />
                    </button>
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">Full Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="settings-input"
                    />
                  </div>
                  <button className="settings-save-btn" onClick={handleEditProfile}>Save Changes</button>
                </div>
              )}
            </div>

            {/* Security */}
            <div className="settings-card">
              <div className="settings-card-header">
                <Icon name="lock" size={20} color="var(--brand-green)" />
                <div className="header-meta-text">
                  <h2 className="settings-card-title">Security</h2>
                  <p className="card-desc-sub">Manage your account security</p>
                </div>
                <Icon name="chevronRight" size={18} color="var(--text-muted)" />
              </div>
              <div className="settings-card-body">
                <button className="settings-menu-item" onClick={() => setShowChangePassword(!showChangePassword)}>
                  <div className="menu-item-left">
                    <Icon name="lock" size={16} color="var(--text-secondary)" />
                    <span>Change Password</span>
                  </div>
                  <Icon name="chevronRight" size={16} color="var(--text-muted)" />
                </button>
              </div>
            </div>

            {/* Transaction Settings */}
            <div className="settings-card">
              <div className="settings-card-header">
                <Icon name="wallet" size={20} color="var(--brand-green)" />
                <div className="header-meta-text">
                  <h2 className="settings-card-title">Transaction Settings</h2>
                  <p className="card-desc-sub">Set up your payment limits</p>
                </div>
                <Icon name="chevronRight" size={18} color="var(--text-muted)" />
              </div>
              <div className="settings-card-body expanded-padding">
                <div className="settings-form-group">
                  <label className="settings-form-label">Daily Limit (₦)</label>
                  <input
                    type="number"
                    value={transaction.dailyLimit}
                    onChange={(e) => handleTransactionChange("dailyLimit", e.target.value)}
                    className="settings-input"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Appearance Framework Engine Layout */}
            <div className="settings-card">
              <div className="settings-card-header">
                <Icon name="palette" size={20} color="var(--brand-green)" />
                <div className="header-meta-text">
                  <h2 className="settings-card-title">Appearance</h2>
                  <p className="card-desc-sub">Customize how KoloPocket looks</p>
                </div>
                <Icon name="chevronRight" size={18} color="var(--text-muted)" />
              </div>
              <div className="settings-card-body">
                <div className="settings-menu-item">
                  <div className="menu-item-left">
                    <Icon name="sun" size={16} color="var(--text-secondary)" />
                    <span>Theme</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="badge-value-text">
                      {theme === "light" ? "Light Mode" : theme === "dark" ? "Dark Mode" : "System Auto"}
                    </span>
                    <Icon name="chevronRight" size={16} color="var(--text-muted)" />
                  </div>
                </div>

                {/* Theme Selection Toggle Button Row */}
                <div className="theme-options">
                  <button
                    className={`theme-btn ${theme === "light" ? "active" : ""}`}
                    onClick={() => handleThemeChange("light")}
                  >
                    <Icon name="sun" size={20} color={theme === "light" ? "var(--brand-green)" : "var(--text-muted)"} />
                    <span>Light</span>
                  </button>

                  <button
                    className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                    onClick={() => handleThemeChange("dark")}
                  >
                    <Icon name="moon" size={20} color={theme === "dark" ? "var(--brand-green)" : "var(--text-muted)"} />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Row */}
            <div className="settings-card logout-card-wrapper" onClick={handleLogout}>
              <div className="settings-card-header clean-logout-row">
                <Icon name="arrowLeft" size={20} color="#EF4444" />
                <div className="header-meta-text">
                  <h2 className="settings-card-title logout-text-color">Logout</h2>
                  <p className="card-desc-sub">Sign out of your account Space</p>
                </div>
                <Icon name="chevronRight" size={18} color="#EF4444" />
              </div>
            </div>

          </div>
        </main>
      </div>
      <BottomNav activeNav="settings" />
    </div>
  );
}