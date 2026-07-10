import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import "./Sidebar.css";
import kplogo from "../pages/Dashboard logo.png";// Your original light/default logo[cite: 4]
import kplogoDark from "../pages/Darrk theme logo.png"; // Updated filename to Darrk theme logo.png
import { authContext } from '../Context/authcontext'; //[cite: 4]

const navItems = [
  { to: "/dashboard", icon: "home", label: "Dashboard" },
  { to: "/all-ajo-groups", icon: "ajo", label: "My Ajo" },
  { to: "/transaction", icon: "transactions", label: "Transactions" },
  { to: "/commission", icon: "wallet", label: "Commission" },
  { to: "/contributor", icon: "beneficiaries", label: "Contributors" },
  // { to: "/dashboard/alajo/support", icon: "support", label: "Support" },
  { to: "/settings", icon: "settings", label: "Settings" },
]; 

export default function Sidebar() {
  const navigate = useNavigate();
  const { logOut } = useContext(authContext); //[cite: 4]

  // 1. Local state to keep track of the theme string
  const [currentTheme, setCurrentTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  // 2. Listen to theme changes on the root HTML element
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const updatedTheme = document.documentElement.getAttribute("data-theme") || "light";
      setCurrentTheme(updatedTheme);
    });

    // Start watching your root HTML tag for attribute changes (like data-theme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect(); // Clean up on unmount
  }, []);

  const handleLogout = () => {
    logOut(); //[cite: 4]
  };

  const handleSettingsClick = () => {
    navigate("/settings"); //[cite: 4]
  };

  return (
    <aside className="sidebar">

      {/* DYNAMIC LOGO SLOT */}
      <div className="sidebar-logo">
        <div className="logo-slot">
          <img
            src={currentTheme === 'dark' ? kplogoDark : kplogo} // Dynamically switch logos based on the current theme
            alt="kp logo"
            style={{ width: 190 }} //[cite: 4]
          />
        </div>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard/alajo"}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            {({ isActive }) => (
              <>
                <Icon name={icon} size={18} color={isActive ? "#fff" : "#6b7280"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav> {/*[cite: 4] */}

      {/* Logout */}
      <button
        className="nav-item logout-btn"
        onClick={handleLogout}
      >
        <Icon name="logout" size={18} color="#6b7280" />
        Logout
      </button> {/*[cite: 4] */}
    </aside>
  );
}