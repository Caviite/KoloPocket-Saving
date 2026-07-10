import { NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import "./BottomNav.css";

const navItems = [
  { to: "/dashboard",              icon: "home",    label: "Home"    },
  { to: "/all-ajo-groups",       icon: "ajo",     label: "My Ajo"  },
  { to: "/commission",       icon: "wallet",  label: "Commission"  },
  { to: "/settings",     icon: "profile", label: "Profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">

      {/* Left two items */}
      {navItems.slice(0, 2).map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/dashboard/alajo"}
          className={({ isActive }) => `bottom-nav-item${isActive ? " active" : ""}`}
        >
          {({ isActive }) => (
            <>
              <Icon name={icon} size={20} color={isActive ? "#16a34a" : "#9ca3af"} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}

      {/* Center FAB — Create Ajo Group */}
      <button
        className="bottom-nav-center"
        onClick={() => navigate("/dashboard/alajo/groups/create")}
        aria-label="Create Ajo Group"
      >
        <Icon name="plus" size={22} color="#fff" />
      </button>

      {/* Right two items */}
      {navItems.slice(2).map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-item${isActive ? " active" : ""}`}
        >
          {({ isActive }) => (
            <>
              <Icon name={icon} size={20} color={isActive ? "#16a34a" : "#9ca3af"} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}